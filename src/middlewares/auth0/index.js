const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = (config, { strapi }) => ({
  initialize() {
    strapi.app.use(async (ctx, next) => {
      try {
        const authHeader = ctx.request.header.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return await next();
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token);

        // Get user info from Auth0
        const userInfoResponse = await axios({
          method: 'get',
          url: `https://b-bot-ai.eu.auth0.com/userinfo`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userInfo = userInfoResponse.data;

        // Attempt to find the user in Strapi by their Auth0 ID
        let user = await strapi.query('plugin::users-permissions.user').findOne({
          where: { username: userInfo.nickname },
        });

        // If the user doesn't exist, create them
        if (!user) {
          user = await strapi.entityService.create('plugin::users-permissions.user', {
            data: {
              username: userInfo.nickname,
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
        console.error('Authentication error:', error.message);
        return ctx.unauthorized(`Authentication error: ${error.message}`);
      }
    });
  },
});
