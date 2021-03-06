/**
 * Validators endpoint.
 *
 * @author Chris Spiliotopoulos
 */

const _ = require('lodash');
const Boom = require('boom');
const Resources = require('../../lib/validators/resources').Resources;
const Validator = require('../../lib/validators/validator').Validator;

module.exports = function(server) {

  /**
   * GET /validators/resource
   *
   * Returns the resource validators view.
   */
  server.route({
    path: '/validators/resources',
    method: 'GET',
    config: {
      handler(request, reply) {

        let resources = Resources.getDefinitions();

        resources = _.map(resources, (o) => ({
          name: o.name,
          title: _.capitalize(o.name.split('_').join(' ')),
          description: o.description
        }));

        resources = _.sortBy(resources, 'name');

        const chunks = _.chunk(resources, 10);

        const model = {
          resources: chunks
        };

        return reply.view('features/validators/resources', model);
      }
    }
  });

  server.route({
    path: '/validators/resources/validate',
    method: 'POST',
    config: {

      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },

      handler(request, reply) {

        // get the uploaded resource type
        const type = request.payload.type;

        // get the file stream
        const stream = request.payload.file;

        new Validator(type).validate(stream)
          .then(() => {
            reply();
          })
          .catch((e) => {
            reply(Boom.badRequest(e));
          });
      }
    }
  });

  /**
   * GET /validators/datapackage
   *
   * Returns the datapackage validators view.
   */
  server.route({
    path: '/validators/datapackage',
    method: 'GET',
    config: {
      handler(request, reply) {
        return reply.view('features/validators/datapackage');
      }
    }
  });


};
