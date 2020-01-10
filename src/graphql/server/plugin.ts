import { Server, Request, RouteOptions } from 'hapi';
import { GraphQLOptions, } from 'apollo-server-core';
import { ValueOrPromise } from 'apollo-server-types';
import { Controller } from './controller';

export type IHapiOptionsFunction = (request?: Request) => ValueOrPromise<GraphQLOptions>;

export interface IHapiPluginOptions {
  path: string;
  vhost?: string;
  route?: RouteOptions;
  graphqlOptions: GraphQLOptions | IHapiOptionsFunction;
}

exports.plugin = {
  name: 'graphql',
  register: async (server: Server, options: IHapiPluginOptions, next?: () => void) => {
    if (!options?.graphqlOptions) {
      throw new Error('Apollo Server requires options.');
    }
    const controller = new Controller(options);
    server.route({
      method: ['GET', 'POST'],
      path: options.path || '/graphql',
      vhost: options.vhost || undefined,
      options: options.route || {},
      handler: controller.process,
    });

    if (next) {
      next();
    }
  },
};
