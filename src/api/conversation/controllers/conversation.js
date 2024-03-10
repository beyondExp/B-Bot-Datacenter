'use strict';

/**
 * conversation controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::conversation.conversation', {

  async create(ctx) {
    if(ctx.state.user){
      const user = ctx.state.user;
      const role = ctx.state.user.role
      if(role.name !== "Administrator"){
        const task = await super.create(ctx);
        console.log("Autheniticated Access")
        console.log(user)

        return await strapi.entityService.update("api::conversation.conversation", task.data.id, {
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
      const { id } = ctx.params;
      const expert = await strapi.entityService.findOne('api::conversation.conversation', id, {
        populate: { owner: { fields: ['id'], } },
      })

      if (expert?.owner?.id === user.id) {
        return expert;
      } else {
        return {
          data: null,
          error: {
            message: 'Not authorized'
          }
        }
      }
    }
    return super.findOne(ctx)
  },
  async update(ctx){
    if(typeof ctx.state.user !== "undefined") {
      const user = ctx.state.user;
      const { id } = ctx.params;
      const expert = await strapi.entityService.findOne('api::conversation.conversation', id, {
        populate: { owner: { fields: ['id'], } },
      })

      if (expert?.owner?.id === user.id) {
        return super.update(ctx);
      } else {
        return {
          data: null,
          error: {
            message: 'Not authorized'
          }
        }
      }
    }
    return super.update(ctx);
  },
  async delete(ctx){
    if(typeof ctx.state.user !== "undefined") {
      const user = ctx.state.user;
      const { id } = ctx.params;
      const expert = await strapi.entityService.findOne('api::conversation.conversation', id, {
        populate: { owner: { fields: ['id'], } },
      })

      if (expert?.owner?.id === user.id) {
        return super.delete(ctx);
      } else {
        return {
          data: null,
          error: {
            message: 'Not authorized'
          }
        }
      }
    }
    return super.delete(ctx);
  }

});
