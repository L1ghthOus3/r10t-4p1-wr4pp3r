import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the paused @Interval decorator below
import { Interval } from '@nestjs/schedule';
import { MatchSyncProgressStore } from './match-sync-progress.store';
import { MatchesService } from './matches.service';

/** Crawl interval: every 2.5 minutes. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by the paused @Interval decorator below
const CRAWL_INTERVAL_MS = 2.5 * 60 * 1000;

/**
 * Drives {@link MatchesService.updateMatchData} on a schedule.
 *
 * Each tick advances the crawler by one step: it caches a batch of the current
 * target player's matches and hops to a random co-participant for the next run.
 *
 * Runs every 2.5 minutes (just over the Riot dev-key window of ~100 requests /
 * 2 min). A fixed interval is used rather than `@Cron` because 2.5 minutes is
 * not expressible as a cron schedule.
 */
@Injectable()
export class MatchSyncScheduler {
  private readonly logger = new Logger(MatchSyncScheduler.name);
  /** Guards against a slow run overlapping the next tick. */
  private running = false;

  constructor(
    private readonly matchesService: MatchesService,
    private readonly progress: MatchSyncProgressStore,
  ) {}

  // Paused for now — re-enable by uncommenting the @Interval decorator.
  // @Interval(CRAWL_INTERVAL_MS)
  async crawlStep(): Promise<void> {
    if (this.running) {
      this.logger.warn('Previous crawl still running — skipping this tick.');
      return;
    }
    this.running = true;
    try {
      const next = await this.progress.getNext();
      if (!next) {
        this.logger.warn(
          'No crawl target saved yet — seed one via the cache route.',
        );
        return;
      }
      const result = await this.matchesService.updateMatchData(
        next.puuid,
        next.region,
      );
      this.logger.log(`Crawled ${next.puuid}: ${JSON.stringify(result)}`);
    } catch (e) {
      this.logger.error('Crawl step failed', e as Error);
    } finally {
      this.running = false;
    }
  }
}
