var circles = document.getElementsByTagName('circle');
var body = document.body;
var tl = new TimelineLite();
var meta = document.createElement('meta');
var defaultRadius = 8;
var currentRadius = defaultRadius;

meta.name = 'theme-color';
meta.content = '#fff';

document.getElementsByTagName('head')[0].appendChild(meta);

var randomRuntime = function () {

    return Math.floor(Math.random() * 230) + 140;
};

var generateTo = function (values) {

    return {
        bezier: {
            timeResolution: 0,
            type: 'soft',
            values: values
        },
        ease: Linear.easeNone,
        yoyo: true,
        repeat: -1
    };
};

var randomPercentage = function (min, max) {

    return (Math.random() * (max - min) + min).toFixed(1) + '%';
};

for (var i = 0; i < circles.length; i++) {

    var circle = circles.item(i);

    // randomly set the classes to roughly half and half of each
    var val = Math.round(Math.random()) ? 'a' : 'b';
    circle.setAttribute('class', val);
    circle.className = val;

    // all circles are the same radius... for now
    circle.setAttribute('r', defaultRadius + '%');

    // position the circles for supported svg clients
    circle.setAttribute('cx', randomPercentage(5,95));
    circle.setAttribute('cy', randomPercentage(5,95));

    // add CSS positioning for non svg clients so GSAPs
    // relative based animation ins't weirdly placed
    if (!Modernizr.inlnesvg) {
        circle.style.left = circle.cx;
        circle.style.top = circle.cy;
    }
}

var paths = new Array(circles.length);

for (var j = 0; j < paths.length; j++){
    var length = 300;
    paths[j] = new Array(length);

    var path = paths[j];

    for (var k = 0; k < length; k++){
        path[k] = {
            x: randomPercentage(-350, 350),
            y: randomPercentage(-450, 450)
        };
    }
}

tl
.to('#d0', randomRuntime(), generateTo(paths[0]))
.to('#d1', randomRuntime(), generateTo(paths[1]), 0)
.to('#d2', randomRuntime(), generateTo(paths[2]), 0)
.to('#d3', randomRuntime(), generateTo(paths[3]), 0)
.to('#d4', randomRuntime(), generateTo(paths[4]), 0)
.to('#d5', randomRuntime(), generateTo(paths[5]), 0)
.to('#d6', randomRuntime(), generateTo(paths[6]), 0)
.to('#d7', randomRuntime(), generateTo(paths[7]), 0)
.to('#d8', randomRuntime(), generateTo(paths[8]), 0)
.to('#d9', randomRuntime(), generateTo(paths[9]), 0)
.to('#d10', randomRuntime(), generateTo(paths[10]), 0)
.to('#d11', randomRuntime(), generateTo(paths[11]), 0)
.to('#d12', randomRuntime(), generateTo(paths[12]), 0)
.to('#d13', randomRuntime(), generateTo(paths[13]), 0)
.to('#d14', randomRuntime(), generateTo(paths[14]), 0)
.to('#d15', randomRuntime(), generateTo(paths[15]), 0);

var changeBodyClass = function (e) {
    if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(function () {
        if (e.type === 'touchstart' && e.touches.length > 1) {
            return;
        }

        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }

        var classes = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var index = classes.indexOf(body.className) + 1;

        if (index >= classes.length) {
            index = 0;
        }

        body.className = classes[index];

        meta.content = getComputedStyle(document.body).backgroundColor;
    }, 150);
};

var hammer = new Hammer(document.querySelector('svg'), {
    domEvents: true
});

hammer.get('pinch').set({ enable: true });

hammer.on('pinchmove', function (e) {
    var min = defaultRadius * 0.75;
    var max = defaultRadius * 3.5;

    var scale = Math.max(min, Math.min(currentRadius * e.scale, max));

    for (var l = 0; l < circles.length; l++) {
        var circ = circles.item(l);
        circ.setAttribute('r', scale + '%');
    }
});

if ('addEventListener' in body) {
    body.addEventListener('click', changeBodyClass, false);
    body.addEventListener('touchstart', changeBodyClass, false);
    body.addEventListener('keypress', changeBodyClass, false);
}
else {
    body.attachEvent('onclick', changeBodyClass);
    body.attachEvent('onkeypress', changeBodyClass);
}
