import * as Hapi from '@hapi/hapi';
import Logger from '../util/logger';
import {GraphQlServer} from '../graphql/server';
import { buildSchema } from 'type-graphql';
import * as path from 'path';

export default class Plugins {
  public static async graphQl(server: Hapi.Server): Promise<Error | any> {
    try {
      Logger.info('Plugins - Registering graphql');
      const resolverPath: string | undefined = process.env["GRAPHQL_RESOLVERS"];
      if (!resolverPath) {
        Logger.error("Please provide GRAPHQL_RESOLVERS evn");
        return;
      }

      const schema = await buildSchema({
        resolvers: [path.join(process.cwd(), resolverPath)],
        dateScalarMode: "timestamp",
      });
      const graphQlServer = new GraphQlServer({ schema });
      await Promise.all([
          graphQlServer.bootstrap({ server }),
          graphQlServer.installSubscriptionHandlers(server.listener)
      ]);
    } catch (error) {
      Logger.error(
        `Plugins - Something went wrong when registering graphql plugin: ${error}`
      );
    }
  }

  public static async registerAll(server: Hapi.Server): Promise<Error | any> {
    await Plugins.graphQl(server);
  }

  private static async register(
    server: Hapi.Server,
    plugin: any
  ): Promise<void> {
    Logger.debug('registering: ' + JSON.stringify(plugin));

    return new Promise((resolve) => {
      server.register(plugin);
      resolve();
    });
  }
}
