var events = require('events')
  , util = require('util')
;

function Headset(device) {
  var featureReport;

  events.EventEmitter.call(this);
  this.device = device;

  try {
    featureReport = device.getFeatureReport(0x02, 1);
  } catch(e) {
    console.log(e);
  }

  if(featureReport && (featureReport[0] == 11 || featureReport[0] == 10))
    this.supportsLight = true;

  this.device.on('data', function(data){
    if(data[1] == 1) {
      this.emit('pressed');
    }
  }.bind(this));
}

util.inherits(Headset, events.EventEmitter);

Headset.prototype.light = function(off){
  if(!this.supportsLight)
    return;
  this.device.write([2, off === false ? 0 : 1]);
};

Headset.prototype.close = function(){
  this.device.close();
};

module.exports = Headset;