import { Injectable } from '@nestjs/common';
import { clusterHost, key } from '../utils/config';
import { getJson } from '../utils/getJson';
import { MatchResponse } from '../utils/match-response.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { MatchSyncProgressStore } from './match-sync-progress.store';
import { queueById } from '../utils/queues';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly progress: MatchSyncProgressStore,
  ) {}

  async getNumberOfMatchesByType(queueId: number) {
    return await this.matchRepository.count({ where: { queueId } });
  }

  /**
   * Game modes ranked by how many cached matches use each queueId, most played
   * first. queueIds are resolved to their human-readable mode/map via
   * src/data/queues.json.
   */
  async getMostPlayedGameModes() {
    const rows = await this.matchRepository
      .createQueryBuilder('m')
      .select('m.queueId', 'queueId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('m.queueId')
      .orderBy('count', 'DESC')
      .getRawMany<{ queueId: number | null; count: string }>();

    return rows.map((row) => {
      const queue = queueById(row.queueId);
      return {
        queueId: row.queueId,
        description: queue?.description ?? null,
        map: queue?.map ?? null,
        count: Number(row.count),
      };
    });
  }

  async getMatchIds(puuid: string, region: string, start = 0, count = 20) {
    const url =
      `https://${clusterHost(region)}.api.riotgames.com/lol/match/v5/matches/by-puuid` +
      `/${encodeURIComponent(puuid)}/ids?start=${start}&count=${count}&${key()}`;
    return getJson<string[]>(url, 'Match list');
  }

  async getMatch(id: string, region: string) {
    const url = `https://${clusterHost(region)}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(id)}?${key()}`;
    return getJson<MatchResponse>(url, 'Match');
  }

  /**
   * Caches one batch (~100) of a player's matches, then hops to a random
   * co-participant from the very first match in the batch so the crawl moves to
   * a new player on the next run.
   *
   * The player crawled is the one saved by the previous run (the hop target);
   * the `puuid` argument only seeds the very first run, before any pointer
   * exists.
   */
  async updateMatchData(puuid: string, region: string = 'EUW1') {
    const BATCH = 100;
    // Continue from the player the last run hopped to; fall back to the seed.
    const next = await this.progress.getNext();
    const target = next?.puuid ?? puuid;
    const targetRegion = next?.region ?? region;

    let stored = 0;
    let rateLimited = false;
    // Participants of the first match retrieved this batch — the source we pick
    // the next crawl target from. Resolved on the first iteration, so it's
    // available even if a rate limit stops the batch partway.
    let firstMatchParticipants: string[] | undefined;

    try {
      const matchIds = await this.getMatchIds(target, targetRegion, 0, BATCH);
      const firstMatchId = matchIds[0];
      for (const matchId of matchIds) {
        const exists = await this.matchRepository.exists({
          where: { matchId },
        });
        if (!exists) {
          const match = await this.getMatch(matchId, targetRegion);
          await this.saveMatch(match);
          stored++;
          if (matchId === firstMatchId) {
            firstMatchParticipants = match.metadata.participants;
          }
        } else if (matchId === firstMatchId) {
          // Already cached — read its participants back instead of re-fetching.
          const row = await this.matchRepository.findOne({
            where: { matchId },
            select: { participantPuuids: true },
          });
          firstMatchParticipants = row?.participantPuuids;
        }
      }
    } catch (e) {
      if (isRateLimit(e)) {
        rateLimited = true;
      } else {
        throw e;
      }
    }

    // Hop: pick a random other player from the first match and record them as
    // the next crawl target.
    const nextPuuid = firstMatchParticipants
      ? pickRandomOther(firstMatchParticipants, target)
      : null;
    if (nextPuuid) {
      await this.progress.setNext(nextPuuid, targetRegion);
    }

    const total = await this.matchRepository.count();
    return { target, stored, total, next: nextPuuid, rateLimited };
  }

  /** Builds and persists a match entity from a Riot match payload. */
  private async saveMatch(match: MatchResponse): Promise<void> {
    const entity = this.matchRepository.create({
      matchId: match.metadata.matchId,
      participantPuuids: match.metadata.participants,
      gameMode: match.info.gameMode,
      queueId: match.info.queueId ?? null,
      mapId: match.info.mapId,
      gameVersion: match.info.gameVersion,
      gameDuration: match.info.gameDuration,
      gameCreation: new Date(match.info.gameCreation),
      metadata: match.metadata,
      info: match.info,
    });
    await this.matchRepository.save(entity);
  }
}

/** Picks a random puuid from a match's participants, excluding `current`. */
function pickRandomOther(participants: string[], current: string): string {
  const others = participants.filter((p) => p !== current);
  const pool = others.length ? others : participants;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** getJson throws this exact message on a Riot 429. */
function isRateLimit(e: unknown): boolean {
  return e instanceof Error && e.message.includes('Rate limited');
}
