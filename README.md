#Headset for node
A node.js library for headsets.

## Install
    npm install headset
[*extra steps for node-webkit](#node-webkit)

#Usage
###Get a headset

    var headset = require('headset').get()

Optionally pass you own options to find a head
set

    var headset = require('headset').get(options);

###Get all  headsets

    require('headset').devices();

Optionally you can pass true to show all connected USB HID Devices. This can be useful if the Headset is not detected, or if you are trying out this library with unsupported devices.

    require('headset').devices(showUnsupported);

###Events
You can listen to events specified in device configuration. (see supported.json)

    headset.on('accept', function() { //Call accepted });
  
###Methods
Methods specficified in a device configuration are available to use. (see supported.json)
If you are unsure which headset is attached and if it supports a certain method, then check if it exists first.

    if(headset.lightOn)
      headset.lightOn();

###Adding events (handle Reads from USB)
If you test your own unsupported device / features you can add events as follows

    headset.addEvent(name, hexString);


###Adding methods (write to USB)
If you test your own unsupported device / features you can add methods as follows

    headset.addMethod(name, hexString);

###Close method
Use this when you are done using the headset

    headset.close();

#Supports
All USB Headsets with UC or Lync support should work, but only the following have been tested so far.
* Jabra PRO 930
* Logitech H820e
* Jabra PRO 9470

#Test
Currently testing is just to manually see if a headset works / can be found.
###Trying an unsupported headset
If you want to try an unsupported headset just do npm test and follow the instructions. If a device is found that you can recognize, you can now use the details to manually .get(options) the headset. 
If you find/add a working device it would be great if you report back here under issues or submit a pull request on supported.json.

###<a name="node-webkit"></a>Node-webkit
Headset relies on node-hid. node-hid needs to be built for each platform and specific version of node-webkit, so to make it work you need build node-hid using nw-gyp
https://github.com/rogerwang/node-webkit/wiki/Build-native-modules-with-nw-gyp
