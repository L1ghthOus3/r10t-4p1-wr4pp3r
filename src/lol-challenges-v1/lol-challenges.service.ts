import { Injectable } from '@nestjs/common';
import { key } from 'src/utils/config';
import { getJson } from 'src/utils/getJson';

@Injectable()
export class LolChallengesService {
  constructor() {}

  async getPlayerChallenges(puuid: string, region: string) {
    try {
      const url = `https://${region}.api.riotgames.com/lol/challenges/v1/player-data/${encodeURIComponent(
        puuid,
      )}?${key()}`;
      const challenges = await getJson(url, 'Challenges');
      return challenges;
    } catch (e) {
      console.warn('Challenges lookup failed', e);
      return null;
    }
  }
}
