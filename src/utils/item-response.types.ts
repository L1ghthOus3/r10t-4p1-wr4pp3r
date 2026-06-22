/**
 * Types for the Data Dragon item endpoint:
 * https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/item.json
 */

export interface ItemGold {
  base: number;
  total: number;
  sell: number;
  purchasable: boolean;
}

export interface ItemImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Map availability keyed by map id (e.g. "11", "12"). */
export type ItemMaps = Record<string, boolean>;

/** Active/passive effect amounts keyed as "Effect1Amount", "Effect2Amount", etc. */
export type ItemEffect = Record<string, string>;

export interface ItemRune {
  isrune: boolean;
  tier: number;
  type: string;
}

export interface ItemStats {
  FlatHPPoolMod?: number;
  rFlatHPModPerLevel?: number;
  FlatMPPoolMod?: number;
  rFlatMPModPerLevel?: number;
  PercentHPPoolMod?: number;
  PercentMPPoolMod?: number;
  FlatHPRegenMod?: number;
  rFlatHPRegenModPerLevel?: number;
  PercentHPRegenMod?: number;
  FlatMPRegenMod?: number;
  rFlatMPRegenModPerLevel?: number;
  PercentMPRegenMod?: number;
  FlatArmorMod?: number;
  rFlatArmorModPerLevel?: number;
  PercentArmorMod?: number;
  rFlatArmorPenetrationMod?: number;
  rFlatArmorPenetrationModPerLevel?: number;
  rPercentArmorPenetrationMod?: number;
  rPercentArmorPenetrationModPerLevel?: number;
  FlatPhysicalDamageMod?: number;
  rFlatPhysicalDamageModPerLevel?: number;
  PercentPhysicalDamageMod?: number;
  FlatMagicDamageMod?: number;
  rFlatMagicDamageModPerLevel?: number;
  PercentMagicDamageMod?: number;
  FlatMovementSpeedMod?: number;
  rFlatMovementSpeedModPerLevel?: number;
  PercentMovementSpeedMod?: number;
  rPercentMovementSpeedModPerLevel?: number;
  FlatAttackSpeedMod?: number;
  PercentAttackSpeedMod?: number;
  rPercentAttackSpeedModPerLevel?: number;
  rFlatDodgeMod?: number;
  rFlatDodgeModPerLevel?: number;
  PercentDodgeMod?: number;
  FlatCritChanceMod?: number;
  rFlatCritChanceModPerLevel?: number;
  PercentCritChanceMod?: number;
  FlatCritDamageMod?: number;
  rFlatCritDamageModPerLevel?: number;
  PercentCritDamageMod?: number;
  FlatBlockMod?: number;
  PercentBlockMod?: number;
  FlatSpellBlockMod?: number;
  rFlatSpellBlockModPerLevel?: number;
  PercentSpellBlockMod?: number;
  FlatEXPBonus?: number;
  PercentEXPBonus?: number;
  rPercentCooldownMod?: number;
  rPercentCooldownModPerLevel?: number;
  rFlatTimeDeadMod?: number;
  rFlatTimeDeadModPerLevel?: number;
  rPercentTimeDeadMod?: number;
  rPercentTimeDeadModPerLevel?: number;
  rFlatGoldPer10Mod?: number;
  rFlatMagicPenetrationMod?: number;
  rFlatMagicPenetrationModPerLevel?: number;
  rPercentMagicPenetrationMod?: number;
  rPercentMagicPenetrationModPerLevel?: number;
  FlatEnergyRegenMod?: number;
  rFlatEnergyRegenModPerLevel?: number;
  FlatEnergyPoolMod?: number;
  rFlatEnergyModPerLevel?: number;
  PercentLifeStealMod?: number;
  PercentSpellVampMod?: number;
}

export interface Item {
  name: string;
  description: string;
  colloq: string;
  plaintext: string;
  group?: string;
  consumed?: boolean;
  consumeOnFull?: boolean;
  stacks?: number;
  depth?: number;
  inStore?: boolean;
  hideFromAll?: boolean;
  requiredChampion?: string;
  requiredAlly?: string;
  specialRecipe?: number;
  from?: string[];
  into?: string[];
  image: ItemImage;
  gold: ItemGold;
  tags: string[];
  maps: ItemMaps;
  stats: ItemStats;
  effect?: ItemEffect;
}

/** The `basic` template carries every field with its default value. */
export interface ItemBasic extends Item {
  rune: ItemRune;
}

export interface ItemResponse {
  type: string;
  version: string;
  basic: ItemBasic;
  data: Record<string, Item>;
}
