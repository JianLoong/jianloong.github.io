var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [{
      text: 'Learn JavaScript'
    }, {
      text: 'Learn Vue'
    }, {
      text: 'Build something awesome'
    }]
  }
})