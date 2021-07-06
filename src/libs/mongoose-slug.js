/**
*@file : mongoose-slug.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:16:00 | Saturday, April 03, 2021
*@Editor : Visual Studio Code
*@summary : define slugify plugin
*/
const slugify = require('slugify')

/**
 * generateSlug func
 * @param {String} name
 * @param {Number} num
 * @returns {Slug}  like: "test_abc_1"
 */
async function generateSlug(name, num = 0) {
  let slugStr = String(num ? name + ' ' + num : name)
  let slug = slugify(slugStr).toLowerCase()
  let count = await this.countDocuments({ slug: new RegExp(slug) })

  /**
   * debug performance
   */
  if (process.env.NODE_ENV === 'development') {
    console.log('Generate slug count: ', count)
  }

  if (!count) {
    return slug
  }
  return this.generateSlug(name, num || ++count)
}

/**
 * @param {Schema} schema
 */
module.exports = function (schema) {
  schema.statics.generateSlug = generateSlug
}

module.exports.generateSlug = generateSlug
