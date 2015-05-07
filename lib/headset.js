/* jslint loopfunc: true */

var HID = require('node-hid')
  , hidFinder = require('./hidfinder')
  , events = require('events')
  , util = require('util')
;

function handleData(data) {
  var hexString = data.toString('hex').toLowerCase()
    , key
    , found
    , now = Date.now()
  ;

  if((this.debug || !this.config.read) && hexString)
    console.log('read: '+hexString.substr(0,56));

  for(key in this.config.read) {
    found = this.config.read[key].filter(function(a) { return hexString.indexOf(a.toLowerCase()) === 0; });
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
  this.connectAttempts = 0;

  process.nextTick(this.connect.bind(this));
}

util.inherits(Headset, events.EventEmitter);

Headset.prototype.connect = function(options){
  if(!options && this.connected)
    return;

  if(this.debug)
    console.log('Connecting '+this.connectAttempts);

  if(options)
    this.options = options;

  var device = hidFinder.get(this.options);

  if(!device || !device.path) {

    this.connected = false;
    this.connectAttempts++;
    this.emit('disconnected', new Error('Device not found'));
    if(this.reconnectTimer)
      clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(this.connect.bind(this), Math.pow(1.2,this.connectAttempts)*1000);
    return;
    
  }

  try {
    this.device = new HID.HID(device.path);
  } catch(e) {
    this.emit('disconnected', e);
    return;
  }

  if(!this.device)
    return;

  this.config = device.config;
  this.device.on('data', handleData.bind(this));

  if(this.config && this.config.write) {
    for(var key in this.config.write) {
      if(!this[key])
        this[key] = this.addMethod(key, this.config.write[key]);
    }
  }

  if(this.debug)
    console.log('Connected');

  this.connectAttempts = 0;
  this.connected = true;
  this.emit('connected');
  this.device.on('error', function(err){
    this.connected = false;
    this.connect();
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