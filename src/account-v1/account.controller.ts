import { Controller, Get, Param, Query } from "@nestjs/common";
import { RegionQueryDto } from "src/common/dto/region-query.dto";
import { AccountService } from "./account.service";

@Controller('account-v1')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get('accounts/by-riot-id/:username/:tagLine')
    getAccount(
        @Param('username') username: string,
        @Param('tagLine') tagLine: string,
        @Query() query: RegionQueryDto,
    ) {
        return this.accountService.getAccount(username, tagLine, query.region);
    }
}
