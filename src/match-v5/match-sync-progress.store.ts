import { Injectable } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

/** The next player the crawler should cache from. */
interface CrawlTarget {
  puuid: string;
  region: string;
  updatedAt: string;
}

const FILE_PATH = join(process.cwd(), 'data', 'match-sync-progress.json');

/**
 * Persists the crawler's position: a single "next player" pointer.
 *
 * {@link MatchesService.updateMatchData} caches a batch of one player's matches,
 * then hops to a random co-participant from the last match it saved and records
 * them here, so the following run continues from that player.
 *
 * Backed by a single JSON file. Writes are serialised through an in-memory
 * promise chain so concurrent saves don't clobber the file.
 */
@Injectable()
export class MatchSyncProgressStore {
  private writeChain: Promise<void> = Promise.resolve();

  /** The player to crawl next, or null if none has been recorded yet. */
  async getNext(): Promise<CrawlTarget | null> {
    return this.read();
  }

  /** Record the next player to crawl. */
  async setNext(puuid: string, region: string): Promise<void> {
    const target: CrawlTarget = {
      puuid,
      region,
      updatedAt: new Date().toISOString(),
    };
    this.writeChain = this.writeChain.then(async () => {
      await mkdir(dirname(FILE_PATH), { recursive: true });
      await writeFile(FILE_PATH, JSON.stringify(target, null, 2));
    });
    return this.writeChain;
  }

  private async read(): Promise<CrawlTarget | null> {
    try {
      return JSON.parse(await readFile(FILE_PATH, 'utf8')) as CrawlTarget;
    } catch (e) {
      // Missing file before the first run is expected; anything else is real.
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw e;
    }
  }
}
