import { Controller, Get, Header } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  async health(): Promise<string> {
    let dbUp = true;
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      dbUp = false;
    }

    const uptime = Math.round(process.uptime());
    const timestamp = new Date().toISOString();
    const ok = dbUp;

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>r10t-4p1-wr4pp3r · status</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    background: radial-gradient(1200px 600px at 50% -10%, #1b2740, #0a0e17 60%);
    color: #e6edf3;
  }
  .card {
    width: min(440px, 92vw);
    padding: 32px 36px;
    border: 1px solid #1f2a3a;
    border-radius: 16px;
    background: rgba(18, 24, 38, 0.7);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(8px);
  }
  .head { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .dot {
    width: 12px; height: 12px; border-radius: 50%;
    background: ${ok ? '#3fb950' : '#f85149'};
    box-shadow: 0 0 0 4px ${ok ? 'rgba(63,185,80,.18)' : 'rgba(248,81,73,.18)'};
  }
  h1 { font-size: 18px; margin: 0; letter-spacing: .3px; }
  .status { margin-left: auto; font-size: 13px; font-weight: 600;
    color: ${ok ? '#3fb950' : '#f85149'}; text-transform: uppercase; }
  dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 10px 16px; }
  dt { color: #7d8ba1; font-size: 13px; }
  dd { margin: 0; text-align: right; font-size: 13px; }
  .pill {
    padding: 2px 8px; border-radius: 999px; font-size: 12px;
    background: ${dbUp ? 'rgba(63,185,80,.15)' : 'rgba(248,81,73,.15)'};
    color: ${dbUp ? '#3fb950' : '#f85149'};
  }
  footer { margin-top: 22px; font-size: 11px; color: #56607a; text-align: center; }
</style>
</head>
<body>
  <main class="card">
    <div class="head">
      <span class="dot"></span>
      <h1>r10t-4p1-wr4pp3r</h1>
      <span class="status">${ok ? 'operational' : 'degraded'}</span>
    </div>
    <dl>
      <dt>Service</dt><dd>up</dd>
      <dt>Database</dt><dd><span class="pill">${dbUp ? 'up' : 'down'}</span></dd>
      <dt>Uptime</dt><dd>${uptime}s</dd>
      <dt>Checked</dt><dd>${timestamp}</dd>
    </dl>
    <footer>Riot API proxy · NestJS</footer>
  </main>
</body>
</html>`;
  }
}
