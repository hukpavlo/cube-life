import { Server } from 'http';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';

import { AppModule } from './app.module';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  await app.init();

  return awsServerlessExpress.createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    const server = await bootstrapServer();
    cachedServer = server;
  }

  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE').promise;
};
