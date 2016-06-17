var package = require('./package.json')

//
// SauceLabs conf
//

var sauceLabsConf = {
  sauceLabs: {
    testName: package.name,
    username: 'caiogondim',
    accessKey: '16e6906a-153a-4aec-a34e-00c0f7f58611'
  },
  customLaunchers: {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'Windows 10'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'Windows 10'
    }
  }
}

//
// Export
//

module.exports = function(config) {
  var confOptions = {
    plugins: [
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-safari-launcher'),
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
    reporters: [ 'dots' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      'Chrome',
      'Firefox',
      'Safari'
    ],
    singleRun: false,

    // To avoid DISCONNECTED messages
    browserDisconnectTimeout : 10000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 60000,
  }

  // SauceLabs

  Object.assign(confOptions, sauceLabsConf)
  confOptions.browsers.push(...Object.keys(sauceLabsConf.customLaunchers))

  config.set(confOptions)
};
