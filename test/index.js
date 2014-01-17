var Headset = require('../lib')
  , headset = Headset.get()
  , interval
  , on = false;

if(headset) {

  headset.on('pressed', function(){
    console.log('pressed');
  });

  interval = setInterval(function(){
    headset.light(on);
    on = !on;
  }, 500);

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

    headset.on('pressed', function(){
      console.log('Press event gotten for: ');
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

