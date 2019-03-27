Vue.component('days-list',{
    template: `<div><h1>{{theTitle}}</h1>
    <ul>
      <li v-for="day in days">
      
      <p>Weather Desc: {{day.weather.description}}</p>
        <p>Temperature: {{day.temp}}</p>
        <p>Cloud Coverage:{{day.clouds}}</p>
         <p>Wind Speed : {{day.wind_spd}}</p>
         <p>Feels like: {{day.app_temp}}</p>
        
       
          
      </li>
    </ul>
    </div>`,
    props: ['theTitle', 'days']
  });

  var vm = new Vue({
     el: "#app",
     data: {
            currentWeather: []  //array of characters from API
       },
      created: function(){
        axios.get('https://api.weatherbit.io/v2.0/current?city=London,Ontario,NC&key=7f06f248141a4e7a85201f47f0b6bf05')
        .then(function(response){  
          console.log(response);
          vm.currentWeather = response.data.data
        });
      }
   
  });
  