var Headset = require('../lib')
  , headset = Headset.get()
  , interval
;

if(headset) {

  headset.debug = true;
  headset.on('accept', function(){
    console.log('accept event');
  });

  if(headset.call) {
    headset.call();
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

} else {

  console.log('no supported headset found - trying sweep');

  Headset.devices(true).forEach(function(device){
    var headset;

    try {
      headset = Headset.get({ path: device.path });
    } catch(e) {
      return console.log(e);
    }

    headset.debug = true;
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

