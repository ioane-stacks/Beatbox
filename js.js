jQuery(function () {
    var localTime = 0;
    var gap = .08048;
    var playerEnabled = false;

    var scrWidth, scrHeight;

    scrWidth = parseInt(window.getComputedStyle(document.body).getPropertyValue('width'));
    scrHeight = parseInt(window.getComputedStyle(document.body).getPropertyValue('height'));

    if (scrHeight > scrWidth) {
        alert("Please rotate screen!");
    }

    var validate = 0;

    var l = document.getElementById('l');
    l.muted = true;

    var a1 = document.getElementById('a1');
    var a2 = document.getElementById('a2');
    var a3 = document.getElementById('a3');
    var a4 = document.getElementById('a4');
    var a5 = document.getElementById('a5');

    var b1 = document.getElementById('b1');
    var b2 = document.getElementById('b2');
    var b3 = document.getElementById('b3');
    var b4 = document.getElementById('b4');
    var b5 = document.getElementById('b5');

    var c1 = document.getElementById('c1');

    $('.play').on('click', function () {
        l.muted = true;
        l.play();
        $('.pad').css('display', 'none');
        $('.blr').css('filter', 'blur(0px)');
        playerEnabled = true;
    });

    //Temporary
    function pl() {
        l.muted = true;
        //l.play();
        $('.pad').css('display', 'static');
        $('.blr').css('filter', 'blur(10px)');
        playerEnabled = true;
    }
    pl();
    // ------------------------

    $('.mute').on('click', function () {
        Mute();
    });

    function Mute() {
        if (l.muted == true) {
            l.muted = false;
            $('.mute').css({ 'background-color': 'rgba(0, 0, 0, 0)', 'color': 'rgba(22, 38, 63, 1)' });
            $('.mute').html('Mute');
            console.log(l.muted);
        }
        else {
            l.muted = true;
            $('.mute').html('Muted');
            $('.mute').css({ 'background-color': 'rgba(40, 67, 109, 1)', 'color': 'rgba(78, 117, 180, 1)' });
            console.log(l.muted);
        }
    }

    $('.stop').on('click', function () {
        a1.pause();
        a2.pause();
        a3.pause();
        a4.pause();
        a5.pause();

        b1.pause();
        b2.pause();
        b3.pause();
        b4.pause();
        b5.pause();
    });

    $('#curTime').on('click', function () {
        onCurrentTime();
    });
    $('html, body').on('keydown', function (e) {
        if (e.key == ' ') {
            e.preventDefault();
            onCurrentTime();
            ValidateTime();
        }
    });

    var padBcol;
    class Pad {
        constructor(className, audioId, k) {
            this.className = className;
            this.audioId = audioId;
            this.k = k;
        }
        Start() {
            var enab = true;
            var _className = this.className;
            var _audioId = this.audioId;
            var _k = this.k;
            function PlayWithKeyboard(className, audioId, k) {
                className = _className;
                audioId = _audioId;
                k = _k;
                $('body').on('keydown', function (e) {
                    if (playerEnabled == true) {
                        if (e.key == k) {
                            if (audioId.paused) {
                                $(`.${className}`).css('background-color', 'rgba(40, 67, 109, 1)');
                                audioId.play();
                                audioId.currentTime = localTime;
                                onCurrentTime();
                                validate++;
                                if (enab == true) {
                                    KeyEffector(className, audioId);
                                    enab = false;
                                }
                            }
                            else {
                                $(`.${className}`).css('background-color', 'rgba(0, 0, 0, 0)');
                                audioId.pause();
                                validate--;
                            }
                        }
                    }
                });
            }
            PlayWithKeyboard();
            function playWithMouseClick(className, audioId) {
                className = _className;
                audioId = _audioId;
                $(`.${className}`).on('click', function () {
                    if (audioId.paused) {
                        $(this).css('background-color', 'rgba(40, 67, 109, 1)');
                        audioId.play();
                        audioId.currentTime = localTime;
                        onCurrentTime();
                        validate++;
                        if (enab == true) {
                            KeyEffector(className, audioId);
                            enab = false;
                        }
                    }
                    else {
                        $(this).css('background-color', 'rgba(0, 0, 0, 0)');
                        audioId.pause();
                        validate--;
                    }
                });
            }
            playWithMouseClick();

            function KeyEffector(className, audioId) {
                className = _className;
                audioId = _audioId;
                var context = new AudioContext();;
                var src = context.createMediaElementSource(audioId);
                var analyser = context.createAnalyser();

                src.connect(analyser);
                analyser.connect(context.destination);
                analyser.fftSize = 64;

                var bufferLength = analyser.frequencyBinCount;
                console.log(bufferLength);

                var dataArray = new Uint8Array(bufferLength);

                var barHeight;
                var x = 0.7;
                var count = 0;

                function renderFrame() {
                    requestAnimationFrame(renderFrame);

                    analyser.getByteFrequencyData(dataArray);

                    for (var i = 0; i < bufferLength; i += x) {
                        barHeight = dataArray[i];
                        if (barHeight < 200) {
                            barHeight = barHeight - 110;
                        }
                        if (barHeight <= 0) {
                            barHeight = 0;
                        }
                        var r = 5 * (barHeight / bufferLength);
                        if (audioId == a4) {
                            barHeight = barHeight * 3.7;
                        }


                        if (audioId.paused == true) {
                            $(`.${className}`).css('background-color', `transparent`);
                            $(`.${className}`).css('box-shadow', `none`);
                            $(`.padBox`).css('box-shadow', `none`);
                        }
                        else {
                            //padBox background visualizer
                            if (barHeight > 35 && barHeight < 256) {
                                padBcol = barHeight;
                                if (barHeight < 235) {
                                    padBcol = barHeight - (padBcol / 1.66);
                                    count = 0;
                                }
                                if (rowPriority == 1 && barHeight == 255) {
                                    count++;
                                    if (count >= 3) padBcol = 0;
                                    if (count >= 500) count = 0;
                                }
                            }
                            if (padBcol > 120 && padBcol < 256) {
                                $(`.padBox`).css('background-color', `rgb(${0},${padBcol / 1.3},${padBcol})`);
                                $(`.padBox`).css('box-shadow', `0 0 15px -1px rgba(0,${padBcol / 1.3},${padBcol}, ${padBcol / 255})`);
                            }
                            else if (padBcol >= 85 && padBcol < 160) {
                                $(`.padBox`).css('background-color', `rgb(${padBcol / .4},${0},${padBcol / 2})`);
                                $(`.padBox`).css('box-shadow', `0 0 15px -1px rgb(${padBcol / .4},${0},${padBcol / 2})`);
                            }
                            else if (padBcol >= 0 && padBcol < 85) {
                                $(`.padBox`).css('background-color', `rgb(${padBcol / .2},${padBcol / .2},${0})`);
                                $(`.padBox`).css('box-shadow', `0 0 15px -1px rgb(${padBcol / .2},${padBcol / .2},${0})`);
                            }
                        }

                        $(`.${className}`).css('background-color', `rgba(${r},${barHeight / 1.3},${barHeight}, ${barHeight / 255})`);
                        $(`.${className}`).css('box-shadow', `0 0 10px -1px rgba(0,${barHeight / 1.3},${barHeight}, ${barHeight / 255})`);

                    }
                }

                audioId.play();
                renderFrame();
            }
        }
    }

    setInterval(() => {

    }, 30);
    //ARPs
    var p1 = new Pad('sound1', a1, 'q').Start();
    var p2 = new Pad('sound2', a2, 'w').Start();
    var p3 = new Pad('sound3', a3, 'e').Start();
    var p4 = new Pad('sound4', a4, 'r').Start();
    var p5 = new Pad('sound5', a5, 't').Start();
    var p6 = new Pad('sound6', b1, 'a').Start();
    var p7 = new Pad('sound7', b2, 's').Start();
    var p8 = new Pad('sound8', b3, 'd').Start();
    var p9 = new Pad('sound9', b4, 'f').Start();
    var p10 = new Pad('sound10', b5, 'g').Start();
    var p11 = new Pad('sound11', c1, 'z').Start();



    setInterval(function () {
        if (localTime >= 59.11) {
            l.currentTime = 0;
            a1.currentTime = 0;
            a2.currentTime = 0;
            a3.currentTime = 0;
            a4.currentTime = 0;
            a5.currentTime = 0;
            b1.currentTime = 0;
            b2.currentTime = 0;
            b3.currentTime = 0;
            b4.currentTime = 0;
            b5.currentTime = 0;
            c1.currentTime = 0;
            setTimeout(function () {
                onCurrentTime();
            }, 100);
        }
    }, 4);

    setInterval(function () {
        ConvertToTime(l, 'l1');
        ConvertToTime(a1, 't1');
        ConvertToTime(a2, 't2');
        ConvertToTime(a3, 't3');
        ConvertToTime(a4, 't4');
        ConvertToTime(a5, 't5');
        ConvertToTime(b1, 't6');
        ConvertToTime(b2, 't7');
        ConvertToTime(b3, 't8');
        ConvertToTime(b4, 't9');
        ConvertToTime(b5, 't10');
        ConvertToTime(c1, 't11');

        ValidateTime();

    }, 4);


    //Volume Controler
    var currentHeight = 0;
    var mouseDown = false;
    function VolumeCtrl(audioId, volumeId, volumeBoxId) {
        var Volume = 1;
        $(`.${volumeBoxId}`).on('mousedown', function (e) {
            mouseDown = true;
            var r, g, b;

            if (e.target.className == $(`.${volumeId}`).attr('class')) {
                currentHeight = $(`.${volumeId}`).height() - e.offsetY;
            }
            else {
                currentHeight = $(this).height() - e.offsetY;
            }

            if (currentHeight < 10) {
                currentHeight = 10;
            }

            $(`.${volumeId}`).css('height', `${currentHeight}px`);
            Volume = currentHeight / $(`.${volumeBoxId}`).height();

            if (Volume >= 0.99) {
                Volume = 1;
            }
            if (Volume <= 0.125) {
                Volume = 0;
            }

            audioId.volume = Volume;
            r = Math.round((currentHeight / $(`.${volumeBoxId}`).height()) * 104);
            g = Math.round((currentHeight / $(`.${volumeBoxId}`).height()) * 148);
            b = Math.round((currentHeight / $(`.${volumeBoxId}`).height()) * 208);
            $(`.${volumeId}`).css('background-color', `rgb(${r},${g},${b})`);

        });

        $(`.${volumeBoxId}`).on('mouseup', function () {
            mouseDown = false;
        });

        $(`.${volumeBoxId}`).on('mouseup', function () {
            mouseDown = false;
        });

        $(`.${volumeBoxId}`).on('mousemove', function (e) {
            if (mouseDown == true) {
                if (e.target.className == $(`.${volumeId}`).attr('class')) {
                    currentHeight = $(`.${volumeId}`).height() - e.offsetY;
                }
                else {
                    currentHeight = $(this).height() - e.offsetY;
                }

                if (currentHeight < 10) {
                    currentHeight = 10;
                }
                $(`.${volumeId}`).css('height', `${currentHeight}px`);

                Volume = currentHeight / $(`.${volumeBoxId}`).height();

                if (Volume >= 0.99) {
                    Volume = 1;
                }
                if (Volume <= 0.125) {
                    Volume = 0;
                }
                audioId.volume = Volume;
                var r = Math.round(($(`.${volumeId}`).height() / $(`.${volumeBoxId}`).height()) * 104);
                var g = Math.round(($(`.${volumeId}`).height() / $(`.${volumeBoxId}`).height()) * 148);
                var b = Math.round(($(`.${volumeId}`).height() / $(`.${volumeBoxId}`).height()) * 208);
                $(`.${volumeId}`).css('background-color', `rgb(${r},${g},${b})`);
            }
        });

        $(`.${volumeBoxId}`).on('mouseleave', function () {
            mouseDown = false;
        })
    }

    //Time Controller
    function ConvertToTime(audioId, txtId) {
        let min, sec;
        min = Math.floor(audioId.currentTime / 60);
        sec = (audioId.currentTime - min * 60);

        $(`.${txtId}`).html(`${min}:${sec.toString().substring(0, 6).replace('.', ':')}`);
    }

    var currentId = null;
    function ValidateTime() {
        if (validate == 0) {
            currentId = null;
            $(`.padBox`).css('background-color', `transparent`);
        }
        if (currentId != null) {
            if (currentId.paused == true) {
                CorrectTime();
            }
            else {
                localTime = currentId.currentTime + gap;
            }
        }
        else {
            if (validate < 2) {
                CorrectTime();
            }
        }
    }

    var rowPriority = 0;

    function AudioPriority() {
        CorrectTime();
        if (!a1.paused || !a2.paused || !a3.paused || !a4.paused || !a5.paused) { return rowPriority = 1 }
        else if (rowPriority != 1 && (!b1.paused || !b2.paused || !b3.paused || !b4.paused || !b5.paused)) return rowPriority = 2;
        else if ((rowPriority < 1 < 2) && (!c1.paused)) return rowPriority = 3;
        else return rowPriority = 0;
    }
    setInterval(AudioPriority, 1000);

    function CorrectTime() {
        if (rowPriority == 1) {
            if (a1.paused == false) { currentId = a1; }
            if (a2.paused == false) { currentId = a2; }
            if (a3.paused == false) { currentId = a3; }
            if (a4.paused == false) { currentId = a4; }
            if (a5.paused == false) { currentId = a5; }
        }
        else if (rowPriority == 2) {
            if (b1.paused == false) { currentId = b1; }
            if (b2.paused == false) { currentId = b2; }
            if (b3.paused == false) { currentId = b3; }
            if (b4.paused == false) { currentId = b4; }
            if (b5.paused == false) { currentId = b5; }
        }
        else if (rowPriority == 3) {
            if (c1.paused == false) { currentId = c1; }
        }
        return currentId;
    }

    function onCurrentTime() {
        if (currentId != null) {
            if (a1.paused == false) { a1.currentTime = currentId.currentTime; }
            if (a2.paused == false) { a2.currentTime = currentId.currentTime; }
            if (a3.paused == false) { a3.currentTime = currentId.currentTime; }
            if (a4.paused == false) { a4.currentTime = currentId.currentTime; }
            if (a5.paused == false) { a5.currentTime = currentId.currentTime; }

            if (b1.paused == false) { b1.currentTime = currentId.currentTime; }
            if (b2.paused == false) { b2.currentTime = currentId.currentTime; }
            if (b3.paused == false) { b3.currentTime = currentId.currentTime; }
            if (b4.paused == false) { b4.currentTime = currentId.currentTime; }
            if (b5.paused == false) { b5.currentTime = currentId.currentTime; }

            if (c1.paused == false) { c1.currentTime = currentId.currentTime; }

            console.log('currentTime -> ' + currentId.currentTime);
        }
        CorrectTime();
    }

    //TIME END;


    VolumeCtrl(a1, 'v1', 'vb1');
    VolumeCtrl(a2, 'v2', 'vb2');
    VolumeCtrl(a3, 'v3', 'vb3');
    VolumeCtrl(a4, 'v4', 'vb4');
    VolumeCtrl(a5, 'v5', 'vb5');

    VolumeCtrl(b1, 'v6', 'vb6');
    VolumeCtrl(b2, 'v7', 'vb7');
    VolumeCtrl(b3, 'v8', 'vb8');
    VolumeCtrl(b4, 'v9', 'vb9');
    VolumeCtrl(b5, 'v10', 'vb10');

    VolumeCtrl(c1, 'v11', 'vb11');

});