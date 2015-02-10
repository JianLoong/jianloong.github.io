if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  $(function() {      
    $(".swipe").swipe( { allowPageScroll:"auto",
      swipe:function(event, direction, distance, duration, fingerCount, fingerData) {


        if ( direction == 'right' && distance > 200)
          $("#sidebar-checkbox").prop('checked', true);

        if ( direction == 'left' && distance > 200)
          $("#sidebar-checkbox").prop('checked', false);
      },
      threshold:0
    });
  });
}