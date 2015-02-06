---
layout: page
title: Diablo 3 Gallery
---

<link rel="stylesheet" href="/public/blueimp-gallery/css/blueimp-gallery.min.css">
<div id="blueimp-gallery-carousel" class="blueimp-gallery  blueimp-gallery-carousel blueimp-gallery-controls">
    <div class="slides"></div>
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="play-pause"></a>
    <ol class="indicator"></ol>
</div>

<div id="links" style="display:none">
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script>
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

for ( var i = 0, l = 20; i < l; i++ ) {
    $('#links').append("<a href='/public/img/Screenshots/Screenshot" + zeroPad(i,3) + ".jpg' title='Diablo 3' data-gallery><img src='/public/img/thumbs/Screenshot" + zeroPad(i,3) + "_thumb.jpg' alt='Paragon Level'>");
}
</script>



<script src="/public/blueimp-gallery/js/blueimp-gallery.min.js"></script>
<script>
blueimp.Gallery(
    document.getElementById('links').getElementsByTagName('a'),
    {
        container: '#blueimp-gallery-carousel',
        carousel: true
    }
);
</script>
