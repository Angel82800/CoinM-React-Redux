$(function () {
    var container = $('#container'),
        left = $('#left_panel'),
        right = $('#right_panel'),
        handle = $('#drag');
    $( "#draggable1" ).draggable();
    $( "#draggable2" ).draggable();
    $( "#draggable3" ).draggable();
    $( "#draggable4" ).draggable();
    $( "#draggable5" ).draggable();

    handle.on('mousedown', function (e) {
        isResizing = true;
        left.css('max-width', '95%');
        left.css('min-width', '60%');
        right.css('max-width', '40%');
        right.css('min-width', '5%');
        lastDownX = e.clientX;
    });

    $(document).on('mousemove', function (e) {
        // we don't want to do anything if we aren't resizing.
        if (!isResizing) 
            return;
        
        var offsetRight = container.width() - (e.clientX - container.offset().left)-30;
        var offsetLeft = container.width() - offsetRight-30;

        left.css('width', offsetLeft);
        right.css('width', offsetRight);
    }).on('mouseup', function (e) {
        // stop resizing
        isResizing = false;
    });
});