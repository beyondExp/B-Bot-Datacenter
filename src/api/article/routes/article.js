'use strict';

/**
 * article router.
 */
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/articles',
      handler: 'article.find',
      config: {
        //middlewares: ['global::authZero'],
      },
    },
    {
      method: 'GET',
      path: '/articles/:id',
      handler: 'article.findOne',
      config: {
        //middlewares: ['global::authZero'],
      },
    },
    // Repeat for other routes as necessary
  ],
};
