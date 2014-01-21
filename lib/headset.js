/* jslint loopfunc: true */

var events = require('events')
  , util = require('util')
;

function handleData(data) {
  var hexString = data.toString('hex')
    , key
    , found
    , now = Date.now()
  ;

  if((this.debug || !this.device.config.read) && hexString)
    console.log('read: '+hexString.substr(0,56));

  for(key in this.device.config.read) {
    found = this.device.config.read[key].filter(function(a) { return hexString.indexOf(a) === 0; });
    if(found.length > 0 && (now - this.lastEventDate > 100 || this.lastEvent != key)) {
      this.lastEvent = key;
      this.lastEventDate = now;
      this.emit(key);
      return;
    }
  }
}

function Headset(device) {
  var key;

  events.EventEmitter.call(this);
  this.lastEventDate = Date.now();
  this.lastEvent = '';

  this.device = device;
  if(this.device.config.write) {
    for(key in this.device.config.write) {
      this[key] = this.addMethod(key, this.device.config.write[key]);
    }
  }

  this.device.on('data', handleData.bind(this));
}

util.inherits(Headset, events.EventEmitter);

Headset.prototype.addEvent = function(name, hexString){
  if(this.config.read[name])
    this.config.read[name].push(hexString);
  else
    this.config.read[name] = [hexString];
};

Headset.prototype.addMethod = function(name, hexString){
  console.log('Create method for '+name+' to write '+hexString);
  return function(){
    if(this.debug)
      console.log(name +' writes '+hexString);
    this.device.write(new Buffer(hexString, 'hex'));
  };
};

Headset.prototype.close = function(){
  this.device.close();
};

module.exports = Headset;