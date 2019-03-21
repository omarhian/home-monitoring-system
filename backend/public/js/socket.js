(function(){

    "use strict"
    var socket = io();

    function Arduino(){
      this.getLight = function(){
        socket.on('light',function(data){
          document.getElementById('arduino_light').innerText = data;
        });
      }

      this.getTemperature = function(){
        socket.on('temperature', function(data){
          document.getElementById('arduino_temperature').innerText = data;
        });
    }

    this.getDoorStatus = function(){
      socket.on('door', function(data){
        document.getElementById('arduino_door').innerText = data;
      });
    }

  }

     var arduinoSensors = new Arduino();
     arduinoSensors.getLight();
     arduinoSensors.getTemperature();
     arduinoSensors.getDoorStatus();
})();
