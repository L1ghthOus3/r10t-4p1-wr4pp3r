import { Injectable } from '@nestjs/common';
import { key, platformHost } from '../utils/config';
import { getJson } from '../utils/getJson';

@Injectable()
export class LeagueService {
  constructor() {}

  async getRankedEntry(puuid: string, region: string) {
    try {
      const url =
        `https://${platformHost(region)}.api.riotgames.com/lol/league/v4/entries/by-puuid` +
        `/${encodeURIComponent(puuid)}?${key()}`;
      const entries = await getJson<{ queueType: string }[]>(url, 'Ranked');
      return (
        entries.find((e) => e.queueType === 'RANKED_SOLO_5x5') ||
        entries.find((e) => e.queueType === 'RANKED_FLEX_SR') ||
        null
      );
    } catch (e) {
      console.warn('Ranked lookup failed', e);
      return null;
    }
  }
}
