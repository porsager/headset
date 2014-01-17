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

    var busylight = require('busylight').get(options);

###Get all  headsets

    require('busylight').devices();

Optionally you can pass true to show all connected USB HID Devices. This can be useful if the Headset is not detected, or if you are trying out this library with unsupported devices.

    require('busylight').devices(showUnsupported);

###Pressed Event
The pressed event will fire whenever the main button on the headset is pressed

    headset.on('press', function() { //Call button pressed });
    
###Light method
Use this to control the light on the headset

    headset.light(on)

###Close method
Use this when you are done talking to the headset

    headset.close();


#Supports
All USB Headsets with UC or Lync support should work, but only the following have been tested so far.
* Jabra PRO 930
* Logitech H820e

#Test
Currently testing is just to manually see if a headset works / can be found.
###Trying an unsupported headset
If you want to try an unsupported headset just do npm test and follow the instructions. If a device is found that you can recognize, you can now use the details to manually .get(options) the headset. If you find a working device please report back here under issues or submit a pull request on supported.json.

###<a name="node-webkit"></a>Node-webkit
Headset relies on node-hid. node-hid needs to be built for each platform, so to make it work you need to go to /headset/node_modules/node-hid and do a nw-gyp rebuild
