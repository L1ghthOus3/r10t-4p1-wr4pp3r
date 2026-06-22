import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('most-used-item/:queueId')
  async getMostUsedItem(@Param('queueId', ParseIntPipe) queueId: number) {
    return this.itemsService.getMostUsedItem(queueId);
  }

  @Get('best-items-arena/:championName')
  async getBestItemsOnGivenChampInArena(
    @Param('championName') championName: string,
  ) {
    return await this.itemsService.getBestItemsOnGivenChampInArena(
      championName,
    );
  }
}
