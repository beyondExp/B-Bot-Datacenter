'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  // Override the default find method
  async find(ctx) {
    // Ensure the query only returns articles owned by the current user
    ctx.query = {
      ...ctx.query,
      filters: {
        ...ctx.query.filters,
        owner: ctx.state.user.id,
      },
    };

    // Call the parent handler with the modified context
    const { data, meta } = await super.find(ctx);

    return { data, meta };
  },

  // Override the default findOne method
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    // Adding an additional filter to check for ownership
    query.filters = {
      ...query.filters,
      owner: ctx.state.user.id,
      id,
    };

    // Call the parent handler with the modified context
    const { data, meta } = await super.findOne(ctx, { query });

    // If the article does not belong to the user, return a not found error
    if (!data) {
      return ctx.notFound('No article found with this id for the current user');
    }

    return { data, meta };
  },
}));
