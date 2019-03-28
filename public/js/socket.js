(function(){

    "use strict"
    var socket = io();

    function Arduino(){
      this.getLight = function(){
        socket.on('light',function(data){
          console.log(data);
          if(data > 10){
          document.getElementById('arduino_light_text').innerHTML = '<p>ON</p>'
          document.getElementById('arduino_light').innerHTML = '<img src="images/light-bulb-on.svg" class="image_on">';
        }else{
          document.getElementById('arduino_light_text').innerHTML = '<p>Off</p>'
          document.getElementById('arduino_light').innerHTML = '<img src="images/light-bulb-off.svg" class="image_off">';
        }
        });

      }

      this.getTemperature = function(){
        socket.on('temperature', function(data){
          document.getElementById('arduino_temperature').innerText = data + " F";
          if(data > 80){
            document.getElementById('arduino_temp').innerHTML = '<img src="/images/temp_hot.svg" class="temp_high">';
          }
          else{
            document.getElementById('arduino_temp').innerHTML = '<img src="/images/temp_cool.svg" class="temp_low">';
          }
        });
    }

    this.getDoorStatus = function(){
      socket.on('door', function(data){
        console.log(data);
        document.getElementById('arduino_door').innerText = data;
        if(data != "door is open"){
          document.getElementById('arduin_door').innerHTML = '<img src="/images/door_close.svg" class="temp_high">'
        }else if(data = 'door is close'){
          document.getElementById('arduin_door').innerHTML = '<img src="/images/door_open.svg" class="temp_high">'
        }else{
          console.log('broken');
        }
      });
    }

  }

     var arduinoSensors = new Arduino();
     arduinoSensors.getLight();
     arduinoSensors.getTemperature();
     arduinoSensors.getDoorStatus();
})();