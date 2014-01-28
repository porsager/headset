/* jslint loopfunc: true */

var HID = require('node-hid')
  , hidFinder = require('./hidfinder')
  , events = require('events')
  , util = require('util')
;

function handleData(data) {
  var hexString = data.toString('hex')
    , key
    , found
    , now = Date.now()
  ;

  if((this.debug || !this.config.read) && hexString)
    console.log('read: '+hexString.substr(0,56));

  for(key in this.config.read) {
    found = this.config.read[key].filter(function(a) { return hexString.indexOf(a) === 0; });
    if(found.length > 0 && (now - this.lastEventDate > 100 || this.lastEvent != key)) {
      this.lastEvent = key;
      this.lastEventDate = now;
      this.emit(key);
      return;
    }
  }
}

function Headset(options) {
  events.EventEmitter.call(this);
  this.options = options;
  this.lastEventDate = Date.now();
  this.lastEvent = '';

  process.nextTick(this.connect.bind(this));
}

util.inherits(Headset, events.EventEmitter);

Headset.prototype.connect = function(options){
  if(options)
    this.options = options;

  var device = hidFinder.get(this.options);

  if(!device || !device.path) {
    this.connected = false;
    this.emit('error', new Error('No connected Headset'));
    return;
  }

  this.config = device.config;
  this.device = new HID.HID(device.path);
  
  this.device.on('data', handleData.bind(this));

  if(this.config && this.config.write) {
    for(var key in this.config.write) {
      if(!this[key])
        this[key] = this.addMethod(key, this.config.write[key]);
    }
  }

  this.connected = true;
  this.emit('connected');
  this.device.on('error', function(err){
    this.connected = false;
    console.log(err);
    this.emit('error', err);
  }.bind(this));

};

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
    
    try {
      this.device.write(new Buffer(hexString, 'hex'));
    } catch(e) {
      this.emit('error', new Error('Could not write to headset'));
      this.connect();
    }
  };
};

Headset.prototype.close = function(){
  this.device.close();
};

module.exports = Headset;