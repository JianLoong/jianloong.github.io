var app = new Vue({
  el: '#app',
  data: {
    results : [],
    errors: [],
    selected: ''
  },

  methods: {
    selectSubreddit() {
      axios.get("https://www.reddit.com/r/" + this.selected + ".json")
        .then(response => {
          // JSON responses are automatically parsed.
          //this.posts = response.data
          this.results = response.data.data.children
          console.log(results);
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
});