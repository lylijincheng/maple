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
        'fg': './images/maple-background-h.png',
        'realtime': true,
        'cursor': 'url("./images/leaf.png") 8 8, default',
        'scratchMove': scratchMove,
        'scratchDown': scratchDown
    };

    var slides = [
        [
            {
                image: "http://placehold.it/790x420/ff6600",
                h3: "全球最佳赏枫大道1",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            },
            {
                image: "http://placehold.it/790x420//00ff66",
                h3: "全球最佳赏枫大道2",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            },
            {
                image: "http://placehold.it/790x420/6600ff",
                h3: "全球最佳赏枫大道3",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            }
        ],
        [
            {
                image: "http://placehold.it/790x420/ff6600",
                h3: "全球最佳赏枫大道1",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            },
            {
                image: "http://placehold.it/790x420//00ff66",
                h3: "全球最佳赏枫大道2",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            },
            {
                image: "http://placehold.it/790x420/6600ff",
                h3: "全球最佳赏枫大道3",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            },
            {
                image: "http://placehold.it/790x420//00ff66",
                h3: "全球最佳赏枫大道4",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            },
            {
                image: "http://placehold.it/790x420/6600ff",
                h3: "全球最佳赏枫大道5",
                h4: "阿冈昆省立公园",
                link: "",
                alt: ""
            }
        ]
    ];

    var WEIBO_APP_KEY = "3080877242";

    var swapTimer;
    var swapTime = 0;
    var swapPercentage = 0;

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
        $cover = $('#cover-body');

        $realtimePercentage = $('#realtime-percentage');
        $realtimeSeconds = $('#realtime-seconds');
        $gameResult = $('#game-result');
        $gamePercentage = $('#game-percentage');

        $shareResult = $('#share-result');

        scratch = $cover.wScratchPad(SCRATCHPAD_OPTIONS);

        buildCarousel(slides[0]);

        $('.cover-video').on('click', playVideo);

        $('.slides-set').on('click', updateCarousel);
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

    function playVideo() {
        var html = $('#video-template').html();

        $cover.append(html);
    }

    function updateCarousel(e) {
        var target = $(e.currentTarget);

        // How to destory.
        buildCarousel(slides[target.index()]);
    }

    function buildCarousel(slide) {
        $('.slides-wrapper').html(_.template($('#carousel-template').html(), {
            slides: slide,
            id: 'carousel-generic-' + Math.random().toString(16).slice(2)
        }));
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