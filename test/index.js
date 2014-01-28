var Headset = require('../lib')
  , headset = Headset.get()
  , interval
;

headset.debug = true;

headset.on('accept', function(){
  console.log('accept event');
});

headset.on('connected', function(){

  headset.removeListener('disconnected', sweep);

  console.log(headset.config);
  headset.on('error', function(err) {
    console.log(err);
  });

  if(headset.ring) {
    headset.ring();
    setTimeout(function(){
      headset.connect();
      setTimeout(function(){
        headset.disconnect();
      }, 4000);
    }, 4000);
  }

  if(headset.lightOn) {
    headset.lightOn();
    setTimeout(function(){
      headset.lightOff();
    }, 8000);
  }

  setTimeout(function(){
    clearInterval(interval);
    headset.close();
  }, 20000);

});

function sweep() {
  console.log('no supported headset found - trying sweep');

  Headset.devices(true).forEach(function(device){
    var headset;

    headset = Headset.get({ path: device.path });
    
    headset.debug = true;
    headset.on('disconnected', function(err){
      console.log(err);
    });
    headset.on('accept', function(){
      console.log('Accept event gotten for: ');
      console.log(device);
    });

    setTimeout(function(){
      headset.close();
      console.log('closing');
    }, 20000);
  });

  console.log('please press the headset call button and see if corresponding events appear');
  console.log('disconnecting devices in 20 seconds');
}

headset.once('disconnected', sweep);

setTimeout(function(){}, 20000);