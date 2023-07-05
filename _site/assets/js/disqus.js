 /**
  *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW
  *  TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
  *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT:s
  *  https://disqus.com/admin/universalcode/#configuration-variables
  */
  var disqus_config = function () {
    this.page.url = "http://localhost:4000/assets/js/disqus.js";
    this.page.identifier = "" ||
                           "http://localhost:4000/assets/js/disqus.js";
  }
  function loadDisqusComments() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://jianloonggithubio.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  }
  