import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import type {
  MatchInfo,
  MatchMetadata,
} from '../../utils/match-response.types';

/**
 * A cached Riot Match-V5 match.
 *
 * The Riot payload is large and deeply nested, so the two top-level objects
 * (`metadata` and `info`) are stored verbatim as `jsonb`. A few frequently
 * queried scalars from `info` are promoted to real columns so they can be
 * indexed/filtered without unpacking the JSON, and the participant PUUIDs are
 * denormalised into an array column so a player's matches can be looked up
 * directly.
 */
@Entity('matches')
export class Match {
  /** e.g. "EUW1_7889772576" — the Riot match ID (metadata.matchId). */
  @PrimaryColumn({ type: 'varchar', length: 32 })
  matchId!: string;

  /** PUUIDs of every participant; indexed for "matches by player" lookups. */
  @Index()
  @Column({ type: 'text', array: true })
  participantPuuids!: string[];

  @Index()
  @Column({ type: 'varchar', length: 32 })
  gameMode!: string;

  @Column({ type: 'int', nullable: true })
  queueId!: number | null;

  @Column({ type: 'int' })
  mapId!: number;

  @Column({ type: 'varchar', length: 32 })
  gameVersion!: string;

  /** Match duration in seconds (info.gameDuration). */
  @Column({ type: 'int' })
  gameDuration!: number;

  /** When the game was created, as a real timestamp (from info.gameCreation, ms epoch). */
  @Index()
  @Column({ type: 'timestamptz' })
  gameCreation!: Date;

  @Column({ type: 'jsonb' })
  metadata!: MatchMetadata;

  @Column({ type: 'jsonb' })
  info!: MatchInfo;

  /** When this row was cached locally. */
  @Column({ type: 'timestamptz', default: () => 'now()' })
  fetchedAt!: Date;
}
