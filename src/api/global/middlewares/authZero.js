'use strict';

/**
 * `authZero` middleware to authenticate with Auth0 and create/find user in Strapi
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const authHeader = ctx.request.header.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.unauthorized('Authorization header is not present or invalid.');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);

      // Get user info from Auth0
      const userInfoResponse = await axios({
        method: 'get',
        url: `https://b-bot-ai.eu.auth0.com/userinfo`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const userInfo = userInfoResponse.data;

      // Attempt to find the user in Strapi by their email or a unique identifier
      let user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: userInfo.email },
      });

      // If the user doesn't exist, create them
      if (!user) {
        user = await strapi.entityService.create('plugin::users-permissions.user', {
          data: {
            username: userInfo.nickname || userInfo.email, // Using email as a fallback for username
            email: userInfo.email,
            provider: 'auth0',
            confirmed: true,
            blocked: false,
            // You can add more fields here based on the information available from Auth0
          },
        });
      }

      // Set the user in the context
      ctx.state.user = user;

      await next();
    } catch (error) {
      strapi.log.error('Authentication error:', error.message);
      return ctx.unauthorized(`Authentication error: ${error.message}`);
    }
  };
};
