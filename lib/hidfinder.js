var HID = require('node-hid');

function where(array, options) {
  return array.filter(function(object) {
    for (var key in options.identification) {
      if (options.identification[key] !== object[key])
        return false;
    }
    object.config = options;
    return true;
  });
}

module.exports.devices = function (devices) {
  var foundDevices = [];

  if(!Array.isArray(devices))
    devices = [devices];

  devices.forEach(function(device){
    foundDevices = foundDevices.concat(where(HID.devices(), device));
  });

  return foundDevices;
};

module.exports.get = function (options) {
  var devices = module.exports
  .devices(options)
  .filter(function(device){
    try {
      device = new HID.HID(device.path);
    } catch(e) {
      device = false;
    }

    if(device) {
      device.close();
      return true;
    } else
      return false;
  });

  if(devices.length === 0)
    return null;

  return devices[0];
};