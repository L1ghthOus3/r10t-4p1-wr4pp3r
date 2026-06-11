import { Controller, Get, Param, Query } from "@nestjs/common";
import { RegionQueryDto } from "../common/dto/region-query.dto";
import { LeagueService } from "./league.service";

@Controller('league-v4')
export class LeagueController {
    constructor(private readonly leagueService: LeagueService) {}

    @Get('entries/by-puuid/:puuid')
    getRankedEntry(
        @Param('puuid') puuid: string,
        @Query() query: RegionQueryDto,
    ) {
        return this.leagueService.getRankedEntry(puuid, query.region);
    }
}
