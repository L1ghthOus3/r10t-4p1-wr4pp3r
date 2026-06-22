import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ItemResponse } from '../utils/item-response.types';
import { Match } from '../match-v5/entities/match.entity';
import { queueById } from '../utils/queues';

/** Static Data Dragon item data bundled at src/data/items.json. */
const ITEMS: ItemResponse = JSON.parse(
  readFileSync(join(process.cwd(), 'src', 'data', 'items.json'), 'utf8'),
) as ItemResponse;

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  getItemName(items: ItemResponse, itemId: string) {
    return items.data[itemId]?.name ?? `Unknown (${itemId})`;
  }

  /** Resolve an item id to its name from the local src/data/items.json. */
  getItemNameById(itemId: string): string {
    return ITEMS.data[itemId]?.name ?? `Unknown (${itemId})`;
  }

  /**
   * Ranks the items used most across all cached matches of a given queue,
   * counting every participant. The queue is identified by its Riot `queueId`
   * (see src/data/queues.json) rather than the legacy `gameMode` string, which
   * Riot has deprecated.
   *
   * Reads from the local match cache instead of calling the Riot API, so it
   * only reflects matches the crawler has stored.
   */
  async getMostUsedItem(queueId: number) {
    const matches = await this.matchRepository
      .createQueryBuilder('m')
      .select('m.info', 'info')
      .where('m.queueId = :queueId', { queueId })
      .getRawMany<{ info: Match['info'] }>();

    const itemsUsage = new Map<number, number>();
    for (const { info } of matches) {
      for (const participant of info.participants) {
        const items = [
          participant.item0,
          participant.item1,
          participant.item2,
          participant.item3,
          participant.item4,
          participant.item5,
          participant.item6,
        ];
        for (const itemId of items) {
          if (itemId === 0) continue;
          itemsUsage.set(itemId, (itemsUsage.get(itemId) ?? 0) + 1);
        }
      }
    }

    const items = await this.fetchItemData();
    const queue = queueById(queueId);
    return {
      queueId,
      description: queue?.description ?? null,
      map: queue?.map ?? null,
      items: [...itemsUsage.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([itemId, count]) => ({
          itemName: this.getItemName(items, itemId.toString()),
          count,
        })),
    };
  }

  /** Data Dragon static item data, used to resolve item IDs to names. */
  private async fetchItemData(): Promise<ItemResponse> {
    const url = `https://ddragon.leagueoflegends.com/cdn/16.12.1/data/fr_FR/item.json`;
    const response = await fetch(url);
    return (await response.json()) as ItemResponse;
  }

  async getBestItemsOnGivenChampInArena(name: string) {
    const matches = await this.matchRepository
      .createQueryBuilder('m')
      .where('m.queueId = :queueId', { queueId: 1750 })
      .andWhere(
        `
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(m.info->'participants') p
      WHERE p->>'championName' = :name
    )
  `,
        { name },
      )
      .getMany();

    const participants = matches.flatMap((match) =>
      match.info.participants.filter(
        (participant) => participant.championName === name,
      ),
    );

    const items = participants.flatMap((participant) => [
      participant.item0,
      participant.item1,
      participant.item2,
      participant.item3,
      participant.item4,
      participant.item5,
      participant.item6,
    ]);
    const ARCANE_SWEEPER_ID = '3348';
    const itemsCount = new Map<string, number>();
    for (const item of items) {
      if (!item || item == 0) continue;
      const itemId = item.toString();
      if (itemId === ARCANE_SWEEPER_ID) continue;
      itemsCount.set(itemId, (itemsCount.get(itemId) ?? 0) + 1);
    }

    const totalCount = [...itemsCount.values()].reduce(
      (sum, count) => sum + count,
      0,
    );

    const ranked = [...itemsCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([itemId, count]) => ({
        itemName: this.getItemNameById(itemId),
        count,
        percentage:
          totalCount === 0 ? 0 : Math.round((count / totalCount) * 10000) / 100,
      }));

    return {
      totalCount,
      items: ranked,
    };
  }
}
