'use strict';

/**
 * ability controller
 */


const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ability.ability', {

  async create(ctx) {
    if(user){
      const user = ctx.state.user;
      const role = ctx.state.user.role
      if(role.name !== "Administrator"){
        const task = await super.create(ctx);

        const updated = await strapi.entityService.update("api::ability.ability", task.data.id, {
          data: {
            owner: user.id
          }
        });

        return result;
      }
    } else{
      console.log("admin Access")
    }
  },
  async find(ctx){
    if(typeof user !== "undefined") {

      const user = ctx.state.user;

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id
      };

    }
    return super.find(ctx);
  }

});
