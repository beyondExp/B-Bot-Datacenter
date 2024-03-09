'use strict';

/**
 * llm-model service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::llm-model.llm-model');
