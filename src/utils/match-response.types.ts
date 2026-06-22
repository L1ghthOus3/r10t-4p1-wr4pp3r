/**
 * Types for the Riot Match-V5 match endpoint:
 * https://{cluster}.api.riotgames.com/lol/match/v5/matches/{matchId}
 */

export interface MatchMetadata {
  dataVersion: string;
  matchId: string;
  /** PUUIDs of every participant, in participant order. */
  participants: string[];
}

export interface PlayerBehavior {
  PlayerBehavior_IsHeroInCombat: number;
}

export interface PerkStatPerks {
  defense: number;
  flex: number;
  offense: number;
}

export interface PerkStyleSelection {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export interface PerkStyle {
  description: string;
  selections: PerkStyleSelection[];
  style: number;
}

export interface Perks {
  statPerks: PerkStatPerks;
  styles: PerkStyle[];
}

/** Arena/mission score fields. Keyed "playerScore0".."playerScore11". */
export type Missions = Record<string, number>;

/**
 * Per-participant challenge stats. Every field is optional because Riot only
 * includes the challenges relevant to a given game/participant.
 */
export type Challenges = Record<string, number | number[]>;

export interface Participant {
  PlayerBehavior: PlayerBehavior;
  challenges: Challenges;
  missions: Missions;
  perks: Perks;

  // Arena scoreboard fields
  PlayerScore0: number;
  PlayerScore1: number;
  PlayerScore2: number;
  PlayerScore3: number;
  PlayerScore4: number;
  PlayerScore5: number;
  PlayerScore6: number;
  PlayerScore7: number;
  PlayerScore8: number;
  PlayerScore9: number;
  PlayerScore10: number;
  PlayerScore11: number;
  playerAugment1: number;
  playerAugment2: number;
  playerAugment3: number;
  playerAugment4: number;
  playerAugment5: number;
  playerAugment6: number;
  playerSubteamId: number;
  subteamPlacement: number;
  placement: number;

  // Pings
  allInPings: number;
  assistMePings: number;
  basicPings: number;
  commandPings: number;
  dangerPings: number;
  enemyMissingPings: number;
  enemyVisionPings: number;
  getBackPings: number;
  holdPings: number;
  needVisionPings: number;
  onMyWayPings: number;
  pushPings: number;
  retreatPings: number;
  visionClearedPings: number;

  // Combat / KDA
  assists: number;
  deaths: number;
  kills: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  unrealKills: number;
  killingSprees: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  largestCriticalStrike: number;
  longestTimeSpentLiving: number;

  // Champion
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;

  // Damage
  damageDealtToBuildings: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageDealtToEpicMonsters: number;
  damageSelfMitigated: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;

  // Healing
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalUnitsHealed: number;

  // Gold / items
  goldEarned: number;
  goldSpent: number;
  bountyLevel?: number;
  consumablesPurchased: number;
  itemsPurchased: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  roleBoundItem: number;

  // Objectives
  baronKills: number;
  dragonKills: number;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  nexusKills: number;
  nexusLost: number;
  nexusTakedowns: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  detectorWardsPlaced: number;
  sightWardsBoughtInGame: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  visionScore: number;

  // Minions / jungle
  neutralMinionsKilled: number;
  totalMinionsKilled: number;
  totalAllyJungleMinionsKilled: number;
  totalEnemyJungleMinionsKilled: number;

  // First blood / tower
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;

  // Game-end / surrender flags
  causedGameEndFromIGNBSurrender: boolean;
  eligibleForProgression: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInIGNBSurrender: boolean;
  gameEndedInSurrender: boolean;
  teamEarlySurrendered: boolean;
  teamIGNBSurrendered: boolean;
  wasPremadeWithIGNBGameEndCauser: boolean;
  wasPremadeWithSevereTransgressor: boolean;
  wasSevereTransgressor: boolean;
  win: boolean;

  // Spell casts
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;

  // Identity / position
  participantId: number;
  individualPosition: string;
  lane: string;
  role: string;
  teamId: number;
  teamPosition: string;
  positionAssignedByMatchmaking: string;
  selectedRolePreferences: string;
  profileIcon: number;
  puuid: string;
  riotIdGameName: string;
  riotIdTagline: string;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;

  // Timing / CC
  timeCCingOthers: number;
  timePlayed: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
}

export interface Objective {
  first: boolean;
  kills: number;
}

export interface TeamObjectives {
  baron: Objective;
  champion: Objective;
  dragon: Objective;
  horde?: Objective;
  inhibitor: Objective;
  riftHerald: Objective;
  tower: Objective;
}

export interface TeamBan {
  championId: number;
  pickTurn: number;
}

export interface Team {
  bans: TeamBan[];
  objectives: TeamObjectives;
  teamId: number;
  win: boolean;
}

export interface MatchInfo {
  endOfGameResult: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  platformId?: string;
  queueId?: number;
  tournamentCode?: string;
  participants: Participant[];
  teams: Team[];
}

export interface MatchResponse {
  metadata: MatchMetadata;
  info: MatchInfo;
}
