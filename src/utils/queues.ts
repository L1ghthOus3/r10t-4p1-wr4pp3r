import { readFileSync } from 'fs';
import { join } from 'path';

/** One entry from src/data/queues.json (Riot's queueId reference). */
export interface Queue {
  queueId: number;
  map: string;
  description: string | null;
  notes: string | null;
}

const QUEUES: Queue[] = JSON.parse(
  readFileSync(join(process.cwd(), 'src', 'data', 'queues.json'), 'utf8'),
) as Queue[];

const QUEUE_BY_ID = new Map<number, Queue>(QUEUES.map((q) => [q.queueId, q]));

/** Look up a queue's metadata by its queueId, or undefined if unknown. */
export function queueById(queueId: number | null): Queue | undefined {
  return queueId == null ? undefined : QUEUE_BY_ID.get(queueId);
}
