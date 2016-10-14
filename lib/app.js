import { install } from 'source-map-support';
install();

import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';
import Good from 'good';
import Inert from 'inert';
import Vision from 'vision';
import Joi from 'joi';
import Pack from './../package';

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

const goodOptions = {
  ops: {
    interval: 10000
  },
  reporters: {
    console: [{
      module: 'good-console'
    }, 'stdout']
  }
}

let swaggerOptions = {
  info: {
    title: 'API Documentation',
    version: Pack.version
  }
};

server.register([{
    register: Good,
    options: goodOptions
  },
  Inert,
  Vision, {
    register: HapiSwagger,
    options: swaggerOptions
  }
], (err) => {
  if (err) throw err;
  server.route({
    method: 'GET',
    path: '/test',
    config: {
      tags: ['api', 'test'],
      notes: 'test route',
      description: 'test route',
      handler: (request, reply) => {
        return reply('hello world');
      },
      validate: {
        query: {
          test: Joi.string()
        }
      }
    }
  });

  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });

});