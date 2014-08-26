new function() {

    $(document).ready(whenReady);

    var scratchBackgrouds = [
        './images/app-bg-0.jpg',
        './images/app-bg-1.jpg',
        './images/app-bg-2.jpg',
        './images/app-bg-3.jpg'
    ];

    var scenes = [,,
        './images/map-scene-1.jpg',
        './images/map-scene-2.jpg',
        './images/map-scene-3.jpg',
        './images/map-scene-4.jpg',
        './images/map-scene-5.jpg',
        './images/map-scene-6.jpg',
        './images/map-scene-7.jpg',
        './images/map-scene-8.jpg'
    ];

    var WEIBO_APP_KEY = "3080877242";

    var swapTimer;
    var swapTime = 0;
    var startTime;
    var isPointerDown;

    var $cards;
    var $coverView;
    var $mapView;
    var $scratchLogo;

    var $realtimePercengate;
    var $realtimeSeconds;
    var $gameResult;
    var $gamePercentage;
    var $shareResult;

    var $audioPlayer;

    var scratch;
    var cardView;
    var cardViewInitialized;

    var totalSeconds;
    var animationInterval;
    var audioPlayer;

    var client = detectClient();

    function whenReady() {
        $cards = $('#cards');
        $coverView = $('#cover-view');
        $mapView = $('#map-view');
        $scratchLogo = $coverView.children('.scratch-logo');

        $realtimePercentage = $('#realtime-percentage');
        $realtimeSeconds = $('#realtime-seconds');
        $gameResult = $('#game-result');
        $gamePercentage = $('#game-percentage');

        $audioPlayer = $('#audio-player');

        $shareResult = $('#share-result');
        scratch = $coverView.wScratchPad(getScratchOptions());

        startAnimate();
        initAudioPlayer();

        $mapView.on('click', '.map-scene', goToScene);
        $coverView.on('touchmove', '.arrow-area', removeResult);

        $('#retry-game').on('click', retryGame);
        $('#share-result').on('click', shareGame);

        $('#audio-player').on('click', togglePlayAudio);
    }

    function scratchDown(e, percent) {
        isPointerDown = true;
        if (!startTime) {
            // Start count.
            startTime = new Date;
        }

        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }

    function scratchMove(e, percent) {
        if (isPointerDown) {
            $scratchLogo.css({
                left: e.clientX - 25,
                top: e.clientY - 25
            });
        }
    }

    function scratchUp(e, percent) {
        isPointerDown = false;
        if (percent > 5) {
            this.enable(false);
            this.clear();

            // Show swap result.
            showResult();

            // Init cardView.
            // initCardView();
        }
    }

    function showResult() {
        swapTime = new Date - startTime;

        $gameResult.text((swapTime / 1000).toFixed(1) + '秒');
        $gamePercentage.text((Math.random() * 100 >> 0) + '%');

        if (client.isWeixin) {
            $('.weixin-guide').removeClass('hidden');
            $('.share-area').addClass('hidden');
            $('.game-result').addClass('weixin-result');
        }

        $('.scratch-logo').css('z-index', '0');
        $('.retry-area').removeClass('hidden');
        $('.game-result').addClass('game-result-show');
    }

    function removeResult(e) {
        e.preventDefault();

        $coverView.off('touchmove', '.arrow-area', removeResult);

        $('.game-result').css('bottom', '100%');
        
        // Start cardView
        initCardView();

        // Show Audio
        $audioPlayer.removeClass('hidden').addClass('playing');
        audioPlayer.play();
    }

    function initCardView() {
        var scene = $('<section class="card scene" id="scene"></section>');

        if (!cardViewInitialized) {
            // cardViewInitialized = true;

            setTimeout(function() {
                scene.css('background-image', 'url(' + scenes[2] + ')');

                $('#map').removeClass('hidden');
                $cards.append(scene);

                cardView = new CardView('#view', {
                    dataset: scenes,
                    onUpdateContent: updateContent
                });

                cardViewInitialized = true;
            }, 0);
        }
    }

    function updateContent(el, src) {
        // el.id = cover | map | scene
        console.log(el.id);
        var id = el.id;

        el = $(el);

        if (src === './images/map-scene-8.jpg') {
            src = client.isWeixin ? src.replace('8', '8b') : src.replace('8', '8a');
        }

        if (id === 'map') {
            el.css('background-image', 'url(./images/app-map-bg.jpg)');
        }

        if (!cardViewInitialized) {
            return;
        }

        if (id === 'cover') {
            if (src) {
                $coverView.addClass('hidden')
                    .next('.scene-view')
                        .removeClass('hidden')
                        .css('background-image', 'url(' + src + ')');
            // } else {
            //     el.css('background-image', '');
            //     $('.game-result').removeClass('game-result-show');
            //     $coverView.wScratchPad('reset');
            //     $coverView.wScratchPad('enable', true);
            //     $coverView.removeClass('hidden')
            //         .next('.scene-view').addClass('hidden');
            }
        }

        if (id === 'map') {
            if (src) {
                $mapView.addClass('hidden')
                    .next('.scene-view')
                        .removeClass('hidden')
                        .css('background-image', 'url(' + src + ')');
            // } else {
            //     $mapView.removeClass('hidden')
            //         .next('.scene-view').addClass('hidden');
            }
        }

        if (id === 'scene') {
            if (src) {
                el.css('background-image', 'url(' + src + ')');
            }
        }
    }

    function retryGame() {
        window.location.reload();
    }

    function shareGame() {
        $('.game-result').addClass('hidden').removeClass('game-result-show');
    }

    function startAnimate() {
        var logo = $('.scratch-logo');

        animationInterval = setInterval(function() {
            logo.css('transform', 'translate(' 
                + ((Math.random() * -20 >> 0) + 10) + 'px,' 
                + ((Math.random() * -20 >> 0) + 10) + 'px)');
        }, 1600);
    }

    function getScratchOptions() {
        return {
            'size': 60,
            'bg': scratchBackgrouds[(scratchBackgrouds.length * Math.random()) >> 0],
            'fg': './images/app-fg.jpg',
            'cursor': 'auto',
            'scratchMove': scratchMove,
            'scratchDown': scratchDown,
            'scratchUp': scratchUp
        }
    }

    function goToScene(e) {
        cardView.goToPage($(e.currentTarget).index() + 2);
    }

    function initAudioPlayer() {
        audioPlayer = new Audio;
        audioPlayer.setAttribute('src', './audio/wanting-qu.mp3');
        audioPlayer.setAttribute('preload', true);
    }

    function togglePlayAudio() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            $audioPlayer.removeClass('pause').addClass('playing');
        } else {
            audioPlayer.pause();
            $audioPlayer.removeClass('playing').addClass('pause');
        }
    }

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function detectClient() {
        var UA = navigator.userAgent,

        isAndroid = /Android/i.test(UA),
        isIOS = /CPU (iPhone )?OS \d_\d_\d/i.test(UA),
        isIphone = /iPhone/i.test(UA);
        isIpad = /Ipad/i.test(UA);
        isWindowsPhone = /IEMobile\/1\d\.\d/i.test(UA);
        isMobile = /Mobile/i.test(UA);
        isSafari = /Version\/\d.\d Mobile\/([0-9A-Z])+ Safari\/\d+\.+/i.test(UA),

        isWeixin = /MicroMessenger/i.test(UA),
        isWeibo = /Weibo/i.test(UA);

        return {
            isAndroid: isAndroid,
            isIOS: isIOS,
            isIphone: isIphone,
            isIpad: isIpad,
            isWindowsPhone: !isAndroid && !isIOS && isWindowsPhone,
            isMobile: isMobile,
            isSafari: isSafari,

            isWeixin: isWeixin,
            isWeibo: isWeibo
        }
    }
};