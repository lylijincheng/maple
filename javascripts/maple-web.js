new function() {

    $(document).ready(whenReady);

    var scratchBackgrouds = [
        './images/scratch-bg-0.jpg',
        './images/scratch-bg-1.jpg',
        './images/scratch-bg-2.jpg',
        './images/scratch-bg-3.jpg'
    ];

    var slides = [
        {
            text: '无论任何季节，你都值得亲临尼亚加拉大瀑布，感受世界七大奇景之一的恢宏气势。金秋时节，为世界首屈一指的精品酒庄之旅增添了浪漫情调。尼亚加拉是顶级冰酒酒产地。',
            images: ['0-1', '0-2', '0-3', '0-4'],
            id: 'slides-0'
        },
        {
            text: '秋季的多伦多洋溢着时尚与浪漫，标志性建筑、迷人的安大略湖美景、顶级的购物与美食、再加上另人兴奋不已的夜生活---在加拿大第一大都市，充满活力与激情的多伦多足以点燃你的全部热情！',
            images: ['1-1', '1-2'],
            id: 'slides-1'
        },
        {

            text: '经过慕斯科卡（Muskoka Region），直达著名的阿冈昆省立公园。9月最后一周至10月初，是赏枫的黄金时期；璀璨湖泊和迷人小镇的森林如同被颜料涂抹过一般，何等享受！',
            images: ['2-1', '3-2', '3-3'],
            id: 'slides-2'
        },
        {
            text: '千岛群岛（1000 Islands）一年四季都是热门，但在秋季更为亮眼，火红的枫叶交织出最丰富的视觉层次。登上千岛游轮，尽情享受圣劳伦斯河畔的视觉奇观吧！',
            images: ['3-1', '3-2', '3-3'],
            id: 'slides-3'

        },
        {
            text: '加拿大的首都，她所拥有的丰富历史遗址、国家博物馆、永不停歇的节日庆典，以及愉快的购物与用餐体验，都承载着加拿大引以为傲的传统与文化精华。哥特式的国会大厦、世界遗产里多运河都是你的必游景点。',
            images: ['4-1', '4-2'],
            id: 'slides-4'
        }
    ];

    var WEIBO_APP_KEY = "3080877242";

    var swapTimer;
    var swapTime = 0;
    var startTime;

    var $cover;

    var $gameResult;

    var $totalSeconds;
    var $remotePercentage;

    var $shareGame;
    var $retryGame;

    var $fullMask;

    var scratch;
    var animationInterval;


    function whenReady() {
        $cover = $('#cover-body');

        $gameResult = $('#game-result');

        $totalSeconds = $('#total-seconds');
        $remotePercentage = $('#remote-percentage');

        $shareGame = $('#share-game');
        $retryGame = $('#retry-game');

        $fullMask = $('#full-mask');

        scratch = $cover.wScratchPad(getScratchOptions());
        buildCarousel(slides[0], 0);
        // startAnimate();

        $cover.css('cursor', 'url(./images/maple-icon-100.png) 50 50, default');

        $('.slides-set').on('click', updateCarousel);

        $('#scene-link').on('click', showLayer);
        $('#prize-link').on('click', showLayer);
        $('#video-link').on('click', showLayer);

        $('#location-link').on('click', scrollIntoView);
        $('#trip-link').on('click', scrollIntoView);

        $('#share-game').on('click', shareGame);
        $('#retry-game').on('click', retryGame);

        $('.retry-button').on('click', retryGame);

        $('#full-mask').on('click', '.close-layer', hideMask);
    }

    function scratchDown(e, p) {
        // $cover.css('cursor', 'url(./images/maple-50-active.png) 25 25, default');
        $cover.css('cursor', 'url(./images/maple-icon-100-ref.png) 50 50, default');

        if (!startTime) {
            startTime = new Date;
        }

        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }

        $('.user-guide').addClass('hidden');
    }

    function scratchMove(e, p) {
        // $cover.css('cursor', 'url(./images/maple-50-active.png) 25 25, default');
    }

    function scratchUp(e, p) {
        // if (p > 95) {
        if (p > 50) {
            this.enable(false);
            this.clear();

            // Show swap result.
            // setTimeout(function() {
                showResult();
            // }, 1000);
        }
        $cover.css('cursor', 'auto');
    }

    function showResult() {
        swapTime = new Date - startTime;

        $totalSeconds.text((swapTime / 1000).toFixed(1) + '秒');
        $remotePercentage.text(Math.random() * 100 >> 0);

        $('.game-result').removeClass('hidden');
    }

    function shareGame(e) {
        startTime = null;
        $('.game-result').addClass('hidden');
        $('.retry-button').removeClass('hidden');
    }

    function retryGame(e) {
        startTime = null;
        $('.game-result').addClass('hidden');
        $('.retry-button').addClass('hidden');

        scratch.wScratchPad('reset');
        scratch.wScratchPad('enable', true);

        $('.user-guide').removeClass('hidden');
        $cover.css('cursor', 'url(./images/maple-icon-100.png) 50 50, default');
    }

    function showLayer(e) {
        var html = $('#' + this.id.replace('-link', '') + '-template').html();

        e.preventDefault();
        $fullMask.children('.focus-container').append(html);

        showMask();
    }

    function showMask() {
        $fullMask
            .removeClass('hidden');
    }

    function hideMask(e) {
        e.preventDefault();
        $fullMask.addClass('hidden').find('.content-layer').remove();
    }

    function updateCarousel(e) {
        var target = $(e.currentTarget),
            index = target.index();

        e.preventDefault();

        // How to destory.
        buildCarousel(slides[index], index);
    }

    function buildCarousel(slide, index) {
        $('.slides-wrapper').html(_.template($('#carousel-template').html(), slide));
        $('.slides-type').css('background-position', '0 ' + (index + 1) * (-200) + 'px');
        $('#slides-description').text(slide.text);
    }

    function startAnimate() {
        var logo = $('.user-guide > img');

        animationInterval = setInterval(function() {
            logo.css('transform', 'translate(' 
                + ((Math.random() * -20 >> 0) + 10) + 'px,' 
                + ((Math.random() * -20 >> 0) + 10) + 'px)');
        }, 1600);

        // logo.on('mousedown', function(e) {
        //     $('.user-guide').addClass('hidden');
        //     $cover.css('cursor', 'url(./images/maple-50-active.png) 25 25, default');
        // });
    }

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function scrollIntoView(e) {
        $.scrollTo($(this).data('link'), 800);
    }

    function getScratchOptions() {
        return {
            'size': 80,
            'bg': scratchBackgrouds[(scratchBackgrouds.length * Math.random()) >> 0],
            'fg': './images/maple-background-h.jpg',
            'cursor': 'auto',
            'scratchMove': scratchMove,
            'scratchDown': scratchDown,
            'scratchUp': scratchUp
        }
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