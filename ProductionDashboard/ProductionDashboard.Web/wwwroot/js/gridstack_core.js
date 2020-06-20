/*
    Created by WarOfDevil - 21/06/2020
*/

var grid = GridStack.init({ float: true });

grid.on('added removed change', function (e, items) {
    var str = '';
    items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
    console.log(e.type + ' ' + items.length + ' items:' + str);
});

var items = [
    { x: 2, y: 1, width: 1, height: 1 },
    { x: 2, y: 3, width: 3, height: 1 },
    { x: 4, y: 2, width: 1, height: 1 },
    { x: 3, y: 1, width: 1, height: 2 },
    { x: 0, y: 6, width: 2, height: 2 }
];
var count = 0;

addNewWidget = function () {
    var node = items[count] || {
        x: Math.round(12 * Math.random()),
        y: Math.round(5 * Math.random()),
        width: Math.round(1 + 3 * Math.random()),
        height: Math.round(1 + 3 * Math.random())
    };
    grid.addWidget('<div><div class="grid-stack-item-content">' + count++ + '</div></div>', node);
};


addNewWidget();