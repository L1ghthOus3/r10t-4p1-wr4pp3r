import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { AppModule } from './app.module';

const allowedOrigins = [
  'https://5umm0n3r5-5c4nn3r.dev',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
];

const expressApp = express();

async function configure() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  expressApp.disable('etag');

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.init();
  return app;
}

// Build the Nest app once and reuse it across warm serverless invocations.
let ready: Promise<unknown> | null = null;
function bootstrap() {
  if (!ready) ready = configure();
  return ready;
}

// Vercel serverless entrypoint.
export default async function handler(req: Request, res: Response) {
  await bootstrap();
  expressApp(req, res);
}

// Local / long-running host: start a real listening server.
if (!process.env.VERCEL) {
  void bootstrap().then(() => expressApp.listen(process.env.PORT ?? 3000));
}
