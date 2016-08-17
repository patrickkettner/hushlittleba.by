Modernizr.on('flash', function (hasFlash) {
    var audioContext = window.AudioContext || window.webkitAudioContext;
    var static = document.getElementById('static');
    var music = document.getElementById('music');

    if (Modernizr.audio && Modernizr.audioloop) {
        var staticAudio = document.createElement('audio');

        staticAudio.setAttribute('loop', true);
        var staticAudio2 = staticAudio.cloneNode();
        var musicAudio = staticAudio.cloneNode();

        if (Modernizr.audio.mp3 !== '') {
            musicAudio.src = './audio/music.mp3';
        }
        else if (Modernizr.audio.ogg !== '') {
            musicAudio.src = './audio/music.ogg';
        }

        document.body.appendChild(musicAudio);

        music.addEventListener('click', function (e) {
            musicAudio.paused ? musicAudio.play() : musicAudio.pause();
            e.stopPropagation();
        }, false);

        if (Modernizr.webaudio) {

            audioContext = new audioContext();

            var unblockAudio = function () {

              // create empty buffer
                var buffer = audioContext.createBuffer(1, 1, 22050);
                var source = audioContext.createBufferSource();
                source.buffer = buffer;

                // connect to output (your speakers)
                source.connect(audioContext.destination);

                'start' in source ? source.start(0) : source.noteOn(0);

                window.removeEventListener('touchstart', unblockAudio, false);
            };

            window.addEventListener('touchstart', unblockAudio, false);

            var bufferSize = 4096;
            var pinkNoise = (function () {
                var b0 = 0.0;
                var b1 = 0.0;
                var b2 = 0.0;
                var b3 = 0.0;
                var b4 = 0.0;
                var b5 = 0.0;
                var b6 = 0.0;
                var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
                node.onaudioprocess = function (e) {
                    var output = e.outputBuffer.getChannelData(0);
                    for (var i = 0; i < bufferSize; i++) {
                        var white = Math.random() * 2 - 1;
                        b0 = 0.99886 * b0 + white * 0.0555179;
                        b1 = 0.99332 * b1 + white * 0.0750759;
                        b2 = 0.96900 * b2 + white * 0.1538520;
                        b3 = 0.86650 * b3 + white * 0.3104856;
                        b4 = 0.55000 * b4 + white * 0.5329522;
                        b5 = -0.7616 * b5 - white * 0.0168980;
                        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                        output[i] *= 0.11;
                        b6 = white * 0.115926;
                    }
                };
                return node;
            })();

            static.addEventListener('click', function (e) {
                audioContext.state === 'suspended' ? audioContext.resume() : audioContext.suspend();
                e.stopPropagation();
            }, false);

            audioContext.suspend();
            pinkNoise.connect(audioContext.destination);
        }
        else {
            if (Modernizr.audio.mp3 !== '') {
                staticAudio.src = './audio/pinknoise.mp3';
                staticAudio2.src = './audio/pinknoise2.mp3';
            }
            else if (Modernizr.audio.ogg !== '') {
                staticAudio.src = './audio/pinknoise.ogg';
                staticAudio2.src = './audio/pinknoise2.ogg';
            }

            document.body.appendChild(staticAudio);
            document.body.appendChild(staticAudio2);

            static.addEventListener('click', function (e) {
                if (staticAudio.paused) {
                    staticAudio.play();
                    staticAudio2.play();
                }
                else {
                    staticAudio.pause();
                    staticAudio2.pause();
                }
                e.stopPropagation();
            }, false);
        }
    }
    else if (hasFlash) {
        var movieParam = document.createElement('param');
        var flashVars = document.createElement('param');
        var obj = document.createElement('object');
        var vars = 'autoreplay=true&javascript=on';
        var playing = false;
        var flashVars2;
        var obj2;

        movieParam.setAttribute('value', './dewplayer.swf');
        movieParam.setAttribute('name', 'movie');

        obj.appendChild(movieParam);
        obj.setAttribute('data', 'dewplayer.swf');
        obj.setAttribute('type', 'application/x-shockwave-flash');
        obj2 = obj.cloneNode(true);

        flashVars.setAttribute('name', 'flashvars');
        flashVars2 = flashVars.cloneNode();

        flashVars.setAttribute('value', vars + '&mp3=./audio/pinknoise.mp3');
        flashVars2.setAttribute('value', vars + '&mp3=./audio/pinknoise2.mp3');

        obj.appendChild(flashVars);
        obj2.appendChild(flashVars2);

        document.body.appendChild(obj);
        document.body.appendChild(obj2);


        var toggle = function (e) {
            if (playing) {
                obj.dewstop();
                obj2.dewstop();
            }
            else {
                obj.dewplay();
                obj2.dewplay();
            }
            playing = !playing;

            if ('stopPropagation' in e) {
                e.stopPropagation();
            }
        };

        if ('addEventListener' in window) {
            static.addEventListener('click', toggle, true);
        }
        else {
            static.attachEvent('onclick', toggle);
        }
    }
    else {
        static.style.display = music.style.display = 'none';
    }
});
