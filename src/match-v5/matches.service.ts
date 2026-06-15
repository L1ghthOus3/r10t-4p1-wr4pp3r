import { Injectable } from '@nestjs/common';
import { clusterHost, key } from '../utils/config';
import { getJson } from '../utils/getJson';

@Injectable()
export class MatchesService {
  constructor() {}

  async getMatchIds(puuid: string, region: string, start = 0, count = 20) {
    const url =
      `https://${clusterHost(region)}.api.riotgames.com/lol/match/v5/matches/by-puuid` +
      `/${encodeURIComponent(puuid)}/ids?start=${start}&count=${count}&${key()}`;
    return getJson<string[]>(url, 'Match list');
  }

  async getMatch(id: string, region: string) {
    const url = `https://${clusterHost(region)}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(id)}?${key()}`;
    return getJson<Record<string, unknown>>(url, 'Match');
  }
}
