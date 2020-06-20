/*
    Created by WarOfDevil - 21/06/2020
*/

var grid = GridStack.init({
    alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    ),
    resizable: {
        handles: 'e, se, s, sw, w'
    },
    removable: '#trash',
    removeTimeout: 100,
    acceptWidgets: '.newWidget',
    float: true
});

grid.on('added removed change', function (e, items) {
    var str = '';
    items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
    console.log(e.type + ' ' + items.length + ' items:' + str);
});

// TODO: switch jquery-ui out
$('.newWidget').draggable({
    revert: 'invalid',
    scroll: false,
    appendTo: 'body',
    helper: 'clone'
});