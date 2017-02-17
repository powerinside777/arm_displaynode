var mqtt    = require('mqtt');
var DEVICE = "10.0.0.22"//process.env.DEVICE_IP;
var ID =  "1"//process.env.DEVICE_ID
var PORT = "1025"//process.env.DEVICE_PORT;
var DRIVER =  "projectiondesign"// process.env.DRIVER_NAME
var MQTT_HOST = "mqtt://10.0.0.61:1883"//process.env.MQTT_BROKER;
var MQTT_BROKER_USER = ""//process.env.MQTT_BROKER_USER;
var MQTT_BROKER_PASS = ""//process.env.MQTT_BROKER_PASS;

var DISPLAY = require('./lib');

try{
    var Commands = require("./drivers/"+DRIVER+".json");
}
catch (err){
    Commands =  require("./drivers/pjlink.json");
    console.log('Driver error:','using default');
}





var settings = {
    username:MQTT_BROKER_USER,
    password:MQTT_BROKER_PASS
}

var mqtt_client  = mqtt.connect(MQTT_HOST,settings);
mqtt_client.on('connect', function () {
    mqtt_client.subscribe('room/display/'+ID+'/power');
    console.log('MQTT:','connected');
});


var display = new DISPLAY.Displayclass(DEVICE,PORT,Commands, function(client) {

    client.request();


    mqtt_client.on('message', function (topic, message) {
        console.log('MQTT:'+topic+':'+message.toString());
        if(topic == 'room/display/'+ID+'/power'){

            if(message.toString() == 'on'){
                client.exec(Commands.CMD_ON)
            }
            else if(message.toString() == 'off') {
                client.exec(Commands.CMD_OFF)
            }
            else if(message.toString() == 'hdmi1') {
                client.exec(Commands.CMD_HDMI1)
            }
            else if(message.toString() == 'hdmi2') {
                client.exec(Commands.CMD_HDMI2)
            }
            else if(message.toString() == 'hdmi3') {
                client.exec(Commands.CMD_HDMI3)
            }
            else if(message.toString() == 'hdmi4') {
                client.exec(Commands.CMD_HDMI4)
            }
        }
    });
  setInterval(function() {
    mqtt_client.publish("room/display/1/status", client.statusD.Power.toLowerCase());
  },6000)
});
