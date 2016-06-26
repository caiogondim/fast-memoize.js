// Config file used as example: https://github.com/angular/angular.js/blob/master/karma-shared.conf.js

var package = require('./package.json')
var debug = require('logdown')('Karma')

//
// SauceLabs conf
//

var sauceLabsConf = {
  sauceLabs: {
    testName: package.name,
    username: process.env.SAUCELABS_USERNAME,
    accessKey: process.env.SAUCELABS_ACCESS_KEY
  },
  concurrency: 1,
  customLaunchers: {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'OS X 10.11'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'OS X 10.11'
    },
    'sl_safari_8': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8'
    },
    sl_safari_9: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9'
    },
    sl_ios_9: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9.3',
      deviceName: 'iPhone 6',
      deviceOrientation: 'portrait'
    },
    sl_ios_8: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '8.4',
      deviceName: 'iPhone 6',
      deviceOrientation: 'portrait'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 10',
      version: '11'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    sl_ie_8: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '8'
    },
  }
}

//
// Export
//

module.exports = function(config) {
  if (!process.env.SAUCELABS_USERNAME || !process.env.SAUCELABS_ACCESS_KEY) {
    debug.error('Set env variables `SAUCELABS_USERNAME` and `SAUCELABS_ACCESS_KEY` with your SauceLabs credentials.')
    throw new Error()
  }

  var confOptions = {
    plugins: [
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-sauce-launcher')
    ],
    basePath: '',
    frameworks: [ 'tap' ],
    files: [ 'test/*.js' ],
    preprocessors: {
      'test/*.js': [ 'webpack' ]
    },
    webpack: {
      node : {
        fs: 'empty'
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['dots', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,

    // To avoid DISCONNECTED messages
    browserDisconnectTimeout : 10000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 60000,
  }

  // Add SauceLabs browsers
  Object.assign(confOptions, sauceLabsConf)
  confOptions.browsers.push(...Object.keys(sauceLabsConf.customLaunchers))

  config.set(confOptions)
};
