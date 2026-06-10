<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## API routes

All routes are `GET` and proxy the [Riot Games API](https://developer.riotgames.com/apis). A valid `RIOT_API_KEY` must be set in `.env` (development keys expire every 24 h).

Every route requires a `region` query parameter: the platform code of the player, one of
`BR1, LA1, LA2, NA1, OC1, JP1, KR, SG2, EUN1, EUW1, ME1, RU, TR1`.
An invalid or missing `region` (or any invalid query parameter) returns `400 Bad Request` with the validation details.

### Get an account by Riot ID

```
GET /account-v1/accounts/by-riot-id/:username/:tagLine?region=EUW1
```

Looks up a Riot account from its Riot ID (the `name#tag` shown in the client — pass the two parts as separate path segments). Use this first: it gives you the `puuid` that every other route needs. Special characters in the name (spaces, accents) must be URL-encoded.

```
GET /account-v1/accounts/by-riot-id/Sir%20Tristan%C3%BCs/4862?region=EUW1
```

Returns an [AccountDto](https://developer.riotgames.com/apis#account-v1/GET_getByRiotId):

```json
{
  "puuid": "CcGgHsDdFU58r2bosU4riv...",
  "gameName": "Sir Tristanüs",
  "tagLine": "4862"
}
```

### Get a player's match IDs

```
GET /match-v5/matches/by-puuid/:puuid?region=EUW1&start=0&count=20
```

Lists the most recent match IDs for a player, newest first.

| Query param | Required | Default | Constraints |
|---|---|---|---|
| `region` | yes | — | platform code (see above) |
| `start` | no | `0` | integer ≥ 0, offset for pagination |
| `count` | no | `20` | integer 0–100, number of IDs to return |

Returns an array of match ID strings:

```json
["EUW1_7440912345", "EUW1_7440898765", "EUW1_7440812345"]
```

Paginate by increasing `start` (e.g. `start=20&count=20` for the next page).

### Get a match by ID

```
GET /match-v5/matches/:id?region=EUW1
```

Fetches the full detail of one match; `:id` is a match ID from the previous route (e.g. `EUW1_7440912345`).

Returns a [MatchDto](https://developer.riotgames.com/apis#match-v5/GET_getMatch), a large object with two top-level keys:

```json
{
  "metadata": { "dataVersion": "2", "matchId": "EUW1_7440912345", "participants": ["puuid1", "..."] },
  "info": {
    "gameMode": "CLASSIC",
    "gameDuration": 1903,
    "gameCreation": 1765800000000,
    "queueId": 420,
    "participants": [
      { "puuid": "...", "riotIdGameName": "...", "championName": "Ahri", "teamId": 100, "kills": 7, "deaths": 2, "assists": 11, "win": true, "...": "many more fields" }
    ],
    "teams": [ { "teamId": 100, "win": true, "objectives": { "...": "..." } } ]
  }
}
```

`info.participants` has one entry per player (10 in a normal game) — match them to a player via `puuid`.

### Get a player's ranked entry

```
GET /league-v4/entries/by-puuid/:puuid?region=EUW1
```

Returns the player's ranked **solo queue** entry, falling back to **flex** if they only play flex, or `null` (empty body, status 200) if the player is unranked **or if the lookup fails** (errors are swallowed by design).

Returns a single [LeagueEntryDto](https://developer.riotgames.com/apis#league-v4/GET_getLeagueEntriesByPUUID) or nothing:

```json
{
  "queueType": "RANKED_SOLO_5x5",
  "tier": "GOLD",
  "rank": "II",
  "leaguePoints": 54,
  "wins": 87,
  "losses": 80,
  "hotStreak": false
}
```

Win rate = `wins / (wins + losses)`; `tier` is IRON → CHALLENGER, `rank` is the division IV → I within the tier.

### Errors

| Status | Meaning |
|---|---|
| `400` | invalid/missing query parameter (validation message in body) |
| `500` | upstream Riot error — body/logs say which: not found, key rejected/expired, or rate limited (Riot dev keys allow 20 req/s, 100 req/2 min) |

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
