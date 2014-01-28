var Headset = require('./headset')
  , hidfinder = require('./hidfinder')
  , supported = require('../supported.json')
;

module.exports.devices = function(findUnsupported){
  return hidfinder.devices(findUnsupported ? {} : supported);
};

module.exports.get = function get(options) {
  return new Headset(options || supported);
};