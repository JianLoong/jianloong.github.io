---
layout: page
title: Diablo 3 Gallery
fa-icon: <i class="fa fa-gamepad"></i>
comments: true
---
<link rel="stylesheet" href="/public/blueimp-gallery/css/blueimp-gallery.min.css">
<div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
    <div class="slides"></div>
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="close">×</a>
    <a class="play-pause"></a>
    <ol class="indicator"></ol>
</div>

<div id="links">
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script>
    function zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
  }
  for ( var i = 0, l = 12; i < l; i++ ) {
    $('#links').append("<a href='/public/img/Screenshots/Screenshot" + zeroPad(i,3) + ".jpg' title='Diablo 3' data-gallery><img style='display:inline' src='/public/img/thumbs/Screenshot" + zeroPad(i,3) + "_thumb.jpg' alt='Paragon Level'>");
}
</script>
<script src="/public/blueimp-gallery/js/blueimp-gallery.min.js"></script>
<script>
document.getElementById('links').onclick = function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {index: link, event: event},
        links = this.getElementsByTagName('a');
    blueimp.Gallery(links, options);
};
</script>
