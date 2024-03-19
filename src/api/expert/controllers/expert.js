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
        const modelData = {
          name: "Base Model",
          identifier: "gpt-3.5-turbo-0125",
        };

        // Create the standard model object by invoking Strapi's entity service
        const model = await strapi.entityService.create('api::llm_model.llm_model', { data: modelData });
        console.log("Model: ",model)
        const returnData =  await strapi.entityService.update("api::expert.expert", task.data.id, {
          data: {
            owner: user.id,
            expert_llm_models: [model.id]
          }
        });

        return returnData
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
      const expert = await strapi.entityService.findOne('api::expert.expert', id, {
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
      const expert = await strapi.entityService.findOne('api::expert.expert', id, {
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
      const expert = await strapi.entityService.findOne('api::expert.expert', id, {
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
