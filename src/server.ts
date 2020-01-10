import * as Hapi from '@hapi/hapi';
import Logger from './util/logger';
import Auth from './auth';
import Plugin from './plugin';
import * as DotEnv from 'dotenv';
import DataBase from './database';

export default class Server {
  private static _instance: Hapi.Server;

  public static async start(): Promise<Hapi.Server> {
    try {
      DotEnv.config({
        path: `${process.cwd()}/.env`,
      });

      Server._instance = new Hapi.Server({
        port: process.env.PORT,
      });

      await DataBase.connect();
      await Auth.registerAll(Server._instance);
      await Plugin.registerAll(Server._instance);

      await Server._instance.start();

      Logger.info(
        `Server - Visit http://${process.env.HOST}:${process.env.PORT}/graphql for GraphQl Playground`
      );

      return Server._instance;
    } catch (error) {
      Logger.info(`Server - There was something wrong: ${error}`);

      throw error;
    }
  }

  public static async stop(): Promise<Error | void> {
    Logger.info(`Server - Stopping execution`);
    await DataBase.closeConnection();
    return Server._instance.stop();
  }

  public static async recycle(): Promise<Hapi.Server> {
    Logger.info(`Server - Recycling instance`);

    await Server.stop();

    return await Server.start();
  }

  public static instance(): Hapi.Server {
    return Server._instance;
  }

  public static async inject(
    options: string | Hapi.ServerInjectOptions
  ): Promise<Hapi.ServerInjectResponse> {
    return await Server._instance.inject(options);
  }
}
