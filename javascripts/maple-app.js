new function() {

    $(document).ready(whenReady);

    var client = detectClient();

    var subFolder = isIphone4 ? '/480' : '/568';

    var scratchBackgrouds = [
        './images/568/app-bg-0.jpg',
        './images/568/app-bg-1.jpg',
        './images/568/app-bg-2.jpg',
        './images/568/app-bg-3.jpg',
        './images/568/app-bg-4.jpg'
    ];

    var ip4Backgrounds = [
        './images/356/app-bg-0-356.jpg',
        './images/356/app-bg-1-356.jpg',
        './images/356/app-bg-2-356.jpg',
        './images/356/app-bg-3-356.jpg',
        './images/356/app-bg-4-356.jpg'
    ];

    var scenes = [
        scratchBackgrouds[(scratchBackgrouds.length * Math.random()) >> 0],
        './images' + subFolder + '/app-map.jpg',
        './images' + subFolder + '/map-scene-1.jpg',
        './images' + subFolder + '/map-scene-2.jpg',
        './images' + subFolder + '/map-scene-3.jpg',
        './images' + subFolder + '/map-scene-4.jpg',
        './images' + subFolder + '/map-scene-5.jpg',
        './images' + subFolder + '/map-scene-6.jpg',
        './images' + subFolder + '/map-scene-7.jpg',
        client.isWeixin ? './images' + subFolder + '/map-scene-8b.jpg' : './images' + subFolder + '/map-scene-8a.jpg'
    ];

    var externalLinks = [
        [
            'http://www.aoyou.com/DomesticPackage/P43191i2', 
            'http://www.sparkletour.com/product?pid=39924&t1', 
            'http://www.jjtonline.com/grouptravel/12820305.html'
        ],
        [
            'http://sh.tuniu.com/tours/20361980',
            'http://www.gzl.com.cn/Outbound/Detail_17693.html',
            'http://www.nanhutravel.com/tour/20072297,184_.html'
        ]
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

    function whenReady() {
        $cards = $('#cards');
        $coverView = $('#cover-view');
        $mapView = $('#map-view');
        $scratchLogo = $coverView.children('.scratch-logo');

        $realtimePercentage = $('#realtime-percentage');
        $realtimeSeconds = $('#realtime-seconds');
        $gameResult = $('#game-result');
        $gamePercentage = $('#remote-percentage');

        $audioPlayer = $('#audio-player');

        $shareResult = $('#share-result');
        scratch = $coverView.wScratchPad(getScratchOptions());

        // $mapView.on('click', '.map-scene', goToScene);
        $coverView.on('touchmove', '.arrow-area', removeResult);
        $('#see-more').on('click', removeResult);

        $('#retry-game').on('click', retryGame);
        $('#share-result').on('click', shareGame);

        $('#audio-player').on('click', togglePlayAudio);
        $('.prize-result').on('click', hidePrizeResult);

        // startAnimate();
        initAudioPlayer();

        $('a').on('click', function(e) {
            var ga = getGASend();
            ga('send', 'event', 'link', 'click', this.id || this.href);
        });
    }

    function scratchDown(e) {
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

    function scratchMove(e) {
        // if (isPointerDown) {
        //     $scratchLogo.css({
        //         left: e.clientX - 25,
        //         top: e.clientY - 25
        //     });
        //     // $scratchLogo.css('transform', 
        //     //     'translate3d(' 
        //     //         + (e.clientX - 25) + 'px,' 
        //     //         + (e.clientY - 25) + 'px,' 
        //     //         + '0)'
        //     // );
        // }
    }

    function scratchUp(e, percent) {
        isPointerDown = false;
        if (percent > 95) {
            this.enable(false);
            this.clear();

            // Show swap result.
            showResult();
            $('#global-up-arrow').removeClass('hidden');
        }
    }

    function showResult() {
        swapTime = new Date - startTime;

        $gameResult.text((swapTime / 1000).toFixed(1) + '秒');
        $gamePercentage.text((Math.random() * 100 >> 0) + '%');

        if (client.isWeixin) {
            $('.weixin-guide').removeClass('hidden');
            $('.see-more').removeClass('hidden');
            $('.share-area').addClass('hidden');
            $('.game-result').addClass('weixin-result');
        }

        $('.scratch-logo').css('z-index', '0');
        $('.retry-area').removeClass('hidden');
        $('.game-result').addClass('game-result-show');

        $coverView.children('img').attr('id', 'scratch-background-img');

        if (_.isFunction(r_get_rank)) {
            r_get_rank(swapTime);
        }

        setTimeout(function() {
            $coverView.on('touchmove', '.weixin-result', removeResult);
        }, 1000);
    }

    function removeResult(e) {
        e && e.preventDefault();

        $coverView.off('touchmove', '.arrow-area', removeResult);
        $coverView.off('touchmove', '.weixin-result', removeResult);

        $('#see-more').off('click', removeResult);

        $('.game-result').css('bottom', '100%');


        $('#map').removeClass('hidden').css('background-image', 'url(' + scenes[1] + ')');
        $('#scene').removeClass('hidden').css('background-image', 'url(' + scenes[2] + ')');
        5
        // Start cardView
        initCardView();

        // Show Audio
        $audioPlayer.removeClass('hidden').addClass('playing');
        audioPlayer.play();
    }

    function initCardView() {

        if (!cardViewInitialized) {
            // cardViewInitialized = true;

            setTimeout(function() {

                cardView = new CardView('#view', {
                    deg: 30,
                    dataset: scenes,
                    onUpdateContent: updateContent
                });

                cardViewInitialized = true;
            }, 0);
        }
    }

    function updateContent(el, src) {
        // el.id = cover | map | scene
        var id = el.id, ga;
        console.log(id);

        el = $(el);

        if (!cardViewInitialized) {
            return;
        }

        if (src === './images' + subFolder + '/map-scene-6.jpg') {
            el.off('click').on('click', { 
                index: 6
            }, goExplore);
        }

        if (src === './images' + subFolder + '/map-scene-7.jpg') {
            el.off('click').on('click', { 
                index: 7
            }, goExplore);
        }

        if (/map-scene-8/.test(src)) {
            el.off('click').on('click', goSocial);
        }

        el.css('background-image', 'url(' + src + ')');

        if (src && id === 'cover') {
            $coverView.addClass('hidden')
                .next('.scene-view')
                    .removeClass('hidden')
                    .css('background-image', 'url(' + src + ')');
        }
        
        ga = getGASend();
        ga('send', 'event', 'card-view', 'update', src);
    }

    function retryGame() {
        window.location.reload();
    }

    function shareGame() {
        $('.game-result').addClass('hidden').removeClass('game-result-show');

        if (_.isFunction(r_init_share_button)) {
            r_init_share_button(swapTime);
        }

        removeResult();
    }

    function showRemoteResult() {
        $('.mask-container').removeClass('hidden');
    }

    function hidePrizeResult() {
        $(this).parent().addClass('hidden');
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
        var backgrounds = client.isIphone4 ? ip4Backgrounds : scratchBackgrouds;

        return {
            size: 50,
            bg: backgrounds[(backgrounds.length * Math.random()) >> 0],
            fg: './images' + subFolder + '/app-fg.jpg',
            realtime: false,
            scratchMove: scratchMove,
            scratchDown: scratchDown,
            scratchUp: scratchUp,
            cursor: 'pointer'
        }
    }

    function goToScene(e) {
        cardView.goToPage($(e.currentTarget).index() + 2);
    }

    function goExplore(e) {
        // console.log(e.data, e.clientY);
        var y = e.clientY,
            i = e.data.index,
            height = $(this).height() / 3,
            ga,
            url,
            links;


        if (i === 6) {
            links = externalLinks[0];
        } else if (i === 7) {
            links = externalLinks[1];
        }

        if (y < height) {
            url = links[0];
        } else if (y > height && y < height * 2) {
            url = links[1];
        } else if (y > height * 2) {
            url = links[2];
        }

        if (url) {
            ga = getGASend();
            ga('send', 'event', 'link', 'click', url);
            
            setTimeout(function() {
                window.open(url);
            }, 1000);
        }
    }

    function goSocial(e) {
        if (e.clientY > $(this).height() / 4 * 3) {
            window.open(client.isWeixin 
                ? 'http://mp.weixin.qq.com/s?__biz=MzA3MjUxMjQxMg==&mid=204075530&idx=1&sn=02b4b4276e7501729e4f51cb9e2ce8f2#rd' 
                : 'http://m.weibo.cn/u/2169647491');
            // console.log(client.isWeixin ? 'weixin' : 'weibo');
        }
    }

    function initAudioPlayer() {
        audioPlayer = new Audio;
        audioPlayer.setAttribute('src', './audio/disk.mp3');
        audioPlayer.setAttribute('preload', true);
    }

    function togglePlayAudio() {
        var ga = getGASend();

        if (audioPlayer.paused) {
            audioPlayer.play();
            $audioPlayer.removeClass('pause').addClass('playing');
            ga('send', 'event', 'music-player', 'click', 'play');
        } else {
            audioPlayer.pause();
            $audioPlayer.removeClass('playing').addClass('pause');
            ga('send', 'event', 'music-player', 'click', 'pause');
        }
    }

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function getGASend() {
        return window.ga || {
            send: function() {}
        };
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

        isIphone4 = window.screen.height === 480;
        isIphone5 = window.screen.height === 568;

        isWeixin = /MicroMessenger/i.test(UA),
        isWeibo = /Weibo/i.test(UA);

        return {
            isAndroid: isAndroid,
            isIOS: isIOS,
            isIphone: isIphone,
            isIphone4: isIphone4,
            isIphone5: isIphone5,
            isIpad: isIpad,
            isWindowsPhone: !isAndroid && !isIOS && isWindowsPhone,
            isMobile: isMobile,
            isSafari: isSafari,

            isWeixin: isWeixin,
            isWeibo: isWeibo
        }
    }
};