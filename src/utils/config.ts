export const REGIONAL_CLUSTER: Record<string, string> = {
  BR1: 'americas',
  LA1: 'americas',
  LA2: 'americas',
  NA1: 'americas',
  OC1: 'americas',
  JP1: 'asia',
  KR: 'asia',
  SG2: 'asia',
  EUN1: 'europe',
  EUW1: 'europe',
  ME1: 'europe',
  RU: 'europe',
  TR1: 'europe',
};
export const key = () =>
  `api_key=${encodeURIComponent(process.env.RIOT_API_KEY || '')}`;
export const clusterHost = (region: string) =>
  REGIONAL_CLUSTER[region] || 'europe';
export const platformHost = (region: string) => region.toLowerCase();
