/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const _ = require('lodash');

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true,
      unique: true
    },
    slug: {
      type: 'string',
      required: true,
      unique: true
    },
    body: {
      type: 'text',
      required: true
    },
    comments: {
      collection: 'comment',
      via: 'post'
    },
    status: {
      enum: ['visible', 'hidden'],
      defaultsTo: 'visible'
    }
  },

  beforeValidate: function (values, cb) {
    // sets the post slug as title in snake case
    values.slug = _.snakeCase(values.title);
    cb();
  }

};
