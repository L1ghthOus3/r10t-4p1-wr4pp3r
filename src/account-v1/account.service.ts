import { Injectable } from "@nestjs/common";
import { clusterHost, key } from "../utils/config";
import { getJson } from "../utils/getJson";

@Injectable()
export class AccountService {
    constructor() { }

    async getAccount(username: string, tagLine: string, region: string) {
        const url =
            `https://${clusterHost(region)}.api.riotgames.com/riot/account/v1/accounts/by-riot-id` +
            `/${encodeURIComponent(username)}/${encodeURIComponent(tagLine)}?${key()}`;
        return getJson(url, "Account").catch((e) => {
            if (/not found/.test(e.message)) throw new Error("No Riot account with that name#tag.");
            throw e;
        });
    }
}