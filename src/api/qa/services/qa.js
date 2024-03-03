'use strict';

/**
 * qa service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::qa.qa');
