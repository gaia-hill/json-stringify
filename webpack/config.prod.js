/**
 * @description
 * @date  Fri May 24 2019 15:10:34 GMT+0800 (CST)
 */

/**
 *
 * @param appWebConfig  webpack config
 * @param redSkullConfig redskull config
 * @param plugins webpack plugins redskull提供几个plugin
 * @param webpack require('webpack')
 * @returns {*}
 */

const fs = require('fs')
const path = require('path')

module.exports = function(appWebConfig,redSkullConfig,plugins,webpack){

  const src = redSkullConfig.src

  const dirs = fs.readdirSync(src)
  appWebConfig.output.libraryTarget = 'umd'
  dirs.forEach(function(dirname){
    appWebConfig.resolve.alias[dirname] = path.join(src,dirname)
  })
  return appWebConfig
}