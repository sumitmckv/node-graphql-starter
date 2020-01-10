import { convertNodeHttpToRequest, runHttpQuery } from 'apollo-server-core';
import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { IHapiPluginOptions } from './plugin';

export class Controller {
  constructor(private options: IHapiPluginOptions) {
  }
  public process = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const { graphqlResponse, responseInit } = await runHttpQuery(
        [request, h],
        {
          method: request.method.toUpperCase(),
          options: this.options.graphqlOptions,
          query:
            request.method === 'post'
              ? // TODO type payload as string or Record
              (request.payload as any)
              : request.query,
          request: convertNodeHttpToRequest(request.raw.req),
        },
      );

      const response = h.response(graphqlResponse);
      if (responseInit?.headers) {
        const apolloHeader = responseInit.headers;
        Object.keys(apolloHeader).forEach(key =>
          response.header(key, apolloHeader[key]),
        );
      }
      return response;
    } catch (error) {
      if ('HttpQueryError' !== error.name) {
        throw Boom.boomify(error);
      }

      if (error.isGraphQLError) {
        const response = h.response(error.message);
        response.code(error.statusCode);
        response.type('application/json');
        return response;
      }

      const err = new Boom(error.message, { statusCode: error.statusCode });
      if (error.headers) {
        Object.keys(error.headers).forEach(header => {
          err.output.headers[header] = error.headers[header];
        });
      }
      // Boom hides the error when status code is 500
      err.output.payload.message = error.message;
      throw err;
    }
  }
}
