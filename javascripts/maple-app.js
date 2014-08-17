new function() {

    $(document).ready(whenReady);

    var ONPAGE_SCROLL_OPTIONS = {
        'easing': 'ease-out',
        'pagination': true,
        'animationTime': 600
        // ,'loop': true
        ,'keyboard': false
    };

    var SCRATCHPAD_OPTIONS = {
        'size': 10,
        'bg': '#0066ff',
        'fg': '#666666',
        'realtime': true,
        'cursor': 'url("./images/leaf.png") 8 8, default',
        'scratchMove': scratchMove,
        'scratchDown': scratchDown
    };

    var WEIBO_APP_KEY = "3080877242";

    var swapTimer;
    var swapTime = 0;
    var swapPercentage = 0;

    var $wrapper;
    var $cover;

    var $realtimePercengate;
    var $realtimeSeconds;
    var $gameResult;
    var $gamePercentage;
    var $shareResult;

    var scratch;
    var onepage;
    var onepageInitialized;
    var onepageEnabled;

    var totalSeconds;

    function whenReady() {
        $wrapper = $('#one-page-wrapper');
        $cover = $('#cover');

        $realtimePercentage = $('#realtime-percentage');
        $realtimeSeconds = $('#realtime-seconds');
        $gameResult = $('#game-result');
        $gamePercentage = $('#game-percentage');

        $shareResult = $('#share-result');

        scratch = $cover.wScratchPad(SCRATCHPAD_OPTIONS);
    }

    function scratchDown() {
        if (swapTime === 0) {
            $('.realtime-percentage').removeClass('hidden');
            swapTimer = setInterval(function() {
                swapTime += .1;
                $realtimeSeconds.text(swapTime.toFixed(1) + '秒');
            }, 100)
        }
    }

    function scratchMove(ctx, percent) {
        percent = percent >> 0;

        $realtimePercentage.text(100 - percent);

        if (percent > 5) {
            this.enable(false);

            if (swapTimer) {
                clearInterval(swapTimer);
                swapTimer = null;
            }

            $('.realtime-percentage').addClass('hidden');

            showResult();
            
            if (!onepageInitialized) {
                initOnepageScroll();
            }
        }
    }

    function showResult() {
        $gameResult.text(swapTime.toFixed(3) + 's');
        $gamePercentage.text((Math.random() * 100 >> 0) + '%');
        $('.game-result').addClass('game-result-show');
    }

    function initOnepageScroll() {
        var $window = $(window);
        $('.map-scene')
            .css({
                'width': $window.width(),
                'height': $window.height()
            });

        if (!onepageInitialized) {
            onepage = $wrapper.onepage_scroll(ONPAGE_SCROLL_OPTIONS);
            onepageInitialized = true;
        }
    }

    function disablePageScroll() {
        $('body')
            .addClass('disabled-onepage-scroll');

        onepageEnabled = false;
    }

    function enablePageScroll() {
        $('body')
            .removeClass('disabled-onepage-scroll');

        onepageEnabled = true;
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