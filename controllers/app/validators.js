/**
 * Validators endpoint.
 *
 * @author Chris Spiliotopoulos
 */

const _ = require('lodash');
const Resources = require('../../lib/validators/resources').Resources;

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
