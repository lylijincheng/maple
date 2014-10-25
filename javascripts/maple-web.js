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
            text: '无论任何季节，你都值得亲临<a target="_blank" href="http://www.ontariotravel.cn/?DestinationShow/id/26.html">尼亚加拉</a>大瀑布，感受世界七大奇景之一的恢宏气势。金秋时节，为世界首屈一指的精品酒庄之旅增添了浪漫情调。尼亚加拉是<a target="_blank" href="http://www.ontariotravel.cn/?ExperienceListt/id/216.html">顶级冰酒</a>酒产地。',
            images: ['0-1', '0-2', '0-3', '0-4'],
            id: 'slides-0',
            link0: 'http://www.ontariotravel.cn/?DestinationShow/id/26.html'
        },
        {
            text: '秋季的<a target="_blank" href="http://www.ontariotravel.cn/?DestinationShow/id/24.html">多伦多</a>洋溢着时尚与浪漫，标志性建筑、迷人的安大略湖美景、顶级的<a target="_blank" href="http://www.ontariotravel.cn/?ExperienceListt/id/214.html">购物与美食</a>、再加上另人兴奋不已的夜生活---在加拿大第一大都市，充满活力与激情的多伦多足以点燃你的全部热情！',
            images: ['1-1', '1-2'],
            id: 'slides-1',
            link0: 'http://www.ontariotravel.cn/?DestinationShow/id/24.html'
        },
        {

            text: '经过慕斯科卡（Muskoka Region），直达著名的<a target="_blank" href="http://www.ontariotravel.cn/?DestinationShow/id/27.html">阿冈昆省立公园</a>。9月最后一周至10月初，是<a target="_blank" href="http://www.ontariotravel.cn/?ExperienceListt/id/213.html">赏枫的黄金时期</a>；白杨、落叶松和红橡将缤纷登场，让你感受到满山红叶的震撼视觉。这里是你亲近秋季自然的最佳选择！',
            images: ['2-1', '3-2', '3-3'],
            id: 'slides-2',
            link0: 'http://www.ontariotravel.cn/?DestinationShow/id/27.html'
        },
        {
            text: '<a target="_blank" href="http://www.ontariotravel.cn/?DestinationShow/id/23.html">千岛群岛（1000 Islands）</a>一年四季都是旅行圣地，但在秋季更为亮眼，斑斓的枫叶交织出最丰富的视觉层次。从安大略东部的金斯顿（Kingston）、罗克波特（Rockport）或加纳诺克（Gananoque）登上<a target="_blank" href="http://www.ontariotravel.cn/?ExperienceShow/id/127.html">千岛游轮</a>，尽情享受圣劳伦斯河畔的视觉奇观吧！',
            images: ['3-1', '3-2', '3-3'],
            id: 'slides-3',
            link0: 'http://www.ontariotravel.cn/?DestinationShow/id/23.html'

        },
        {
            text: '加拿大的首都，她所拥有的丰富历史遗址、国家博物馆、永不停歇的节日庆典，以及愉快的购物与用餐体验，都承载着加拿大引以为傲的<a target="_blank" href="http://www.ontariotravel.cn/?ExperienceListt/id/215.html">传统与文化</a>精华。哥特式的国会大厦、世界遗产里多运河都是你的必游景点。',
            images: ['4-1', '4-2'],
            id: 'slides-4',
            link0: 'http://www.ontariotravel.cn/?DestinationShow/id/25.html'
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
        $('#full-mask').on('click', 'img', hideMask);

        $('a').on('click', function(e) {
            var ga = window.ga || { send: function() {} };
            ga('send', 'event', 'link', 'click', this.id || this.href);
        });
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
        if (p > 95) {
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

        // $remotePercentage.text(Math.random() * 100 >> 0);

        $cover.children('img').attr('id', 'scratch-background-img');

        $('.game-result').removeClass('hidden');

        if (_.isFunction(r_get_rank)) {
            r_get_rank(swapTime);
        }
    }

    function shareGame(e) {
        startTime = null;
        $('.retry-button').removeClass('hidden');
        $('.game-result').addClass('hidden');
    }

    function showRemoteResult() {
        $fullMask.children('.focus-container').append($('#prize-result-template').html());
        showMask();
    }

    function retryGame(e) {
        startTime = null;
        $('.game-result').addClass('hidden');
        $('.retry-button').addClass('hidden');

        $cover.wScratchPad('bg', scratchBackgrouds[(scratchBackgrouds.length * Math.random()) >> 0]);
        $cover.wScratchPad('reset');
        $cover.wScratchPad('enable', true);

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
        $('.slides-type').css('background-position', '0 ' + (-index) * 200 + 'px');
        $('#slides-description').html(slide.text);
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