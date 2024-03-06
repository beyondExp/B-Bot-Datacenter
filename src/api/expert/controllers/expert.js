'use strict';

/**
 * expert controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::expert.expert', {

  async create(ctx) {
    if(ctx.state.user){
      const user = ctx.state.user;
      const role = ctx.state.user.role
      if(role.name !== "Administrator"){
        const task = await super.create(ctx);
        console.log("Autheniticated Access")
        console.log(user)

        return await strapi.entityService.update("api::expert.expert", task.data.id, {
          data: {
            owner: user.id
          }
        });
      }
    } else{
      console.log("admin Access")
    }
  },
  async find(ctx){
    if(typeof ctx.state.user !== "undefined") {
      console.log("Autheniticated Access")

      const user = ctx.state.user;
      console.log(user)
      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id
      };

    }
    return super.find(ctx);
  },
  async findOne(ctx){
    if(typeof ctx.state.user !== "undefined") {

      const user = ctx.state.user;

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id
      };
    }
    return super.findOne(ctx);
  },
  async update(ctx){
    if(typeof ctx.state.user !== "undefined") {

      const user = ctx.state.user;

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id
      };
    }
    return super.update(ctx);
  },
  async delete(ctx){
    if(typeof ctx.state.user !== "undefined") {

      const user = ctx.state.user;

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id
      };
    }
    return super.delete(ctx);
  }

});
