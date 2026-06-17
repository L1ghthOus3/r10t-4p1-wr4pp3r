import { Injectable } from '@nestjs/common';
import { clusterHost, key } from '../utils/config';
import { getJson } from '../utils/getJson';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor() {}

  async getAccount(
    username: string,
    tagLine: string,
    region: string,
  ): Promise<AccountDto> {
    const url = `https://${clusterHost(region)}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(username)}/${encodeURIComponent(tagLine)}?${key()}`;
    return getJson<AccountDto>(url, 'Account').catch((e) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      if (/not found/.test(e.message))
        throw new Error('No Riot account with that name#tag.');
      throw e;
    });
  }

  async getAccountByPuuid(puuid: string, region: string): Promise<AccountDto> {
    const url = `https://${clusterHost(region)}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}?${key()}`;
    return getJson<AccountDto>(url, 'Account').catch((e) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      if (/not found/.test(e.message))
        throw new Error('No Riot account with that puuid.');
      throw e;
    });
  }
}
