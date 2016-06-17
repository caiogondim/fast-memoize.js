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
      platform: 'Windows 7',
      version: '35'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '30'
    },
    sl_ios_safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7.1'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
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
