Vue.component('news-list',{
  template: `<div><h1>{{theTitle}}</h1>
  <ul>
    <li v-for="headline in headlines">
     <p>{{headline.title}}</p>
     <p>{{headline.description}}</p>
    </li>
  </ul>
  </div>`,
  props: ['theTitle', 'headlines']
});

var vm = new Vue({
   el: "#app",
   data: {
   	   NewsHeadlines: []  //array of characters from API
     },
    created: function(){
      axios.get('https://newsapi.org/v2/top-headlines?sources=bbc-news&pageSize=2&apiKey=666f868bab0644e09850f923cc2a0520')
      .then(function(response){  
        console.log(response);
        vm.NewsHeadlines = response.data.articles
      });
    }
 
});
//components are reusable Vue instances with a name
//a component's data option must be a function, so that each instance can maintain an independent copy of the returned data object