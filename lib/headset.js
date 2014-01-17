var events = require('events')
  , util = require('util')
;

function Headset(device) {
  events.EventEmitter.call(this);
  this.device = device;

  this.device.on('data', function(data) {
    var value = data[this.device.info.callButton.position];
    if(this.device.info.callButton.values.indexOf(value) !== -1)
      this.emit('pressed');
  }.bind(this));
}

util.inherits(Headset, events.EventEmitter);

Headset.prototype.light = function(off){
  if(!this.device.info.light)
    return;
  this.device.write([
    this.device.info.reportId,
    off === false ? this.device.info.light.off : this.device.info.light.on
  ]);
};

Headset.prototype.close = function(){
  this.device.close();
};

module.exports = Headset;