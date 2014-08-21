new function() {

    $(document).ready(whenReady);

    var SCRATCHPAD_OPTIONS = {
        'size': 10,
        'bg': '#0066ff',
        'fg': './images/maple-background-v.png',
        'realtime': true,
        'cursor': 'url("./images/leaf.png") 8 8, default',
        'scratchMove': scratchMove,
        'scratchDown': scratchDown
    };

    var scenes = [,,
        {
            background: '//placehold.it/1000x1000/0066ff',
            title: 'Lorem ipsum dolor1.',
            top: '200',
            intros: [
                {
                    header: 'Lorem ipsum.',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, perferendis.' 
                }, 
                {
                    header: 'Lorem ipsum.',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, perferendis.' 
                }
            ]
        },
        {
            background: '//placehold.it/1000x1000/ff6600',
            title: 'Lorem ipsum dolor2.',
            top: '300',
            intros: [
                {
                    header: 'Lorem ipsum.1',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, perferendis.' 
                }
            ]
        },
        {
            background: '//placehold.it/1000x1000/ff6600',
            title: 'Lorem ipsum dolor3.',
            top: '300',
            intros: [
                {
                    header: 'Lorem ipsum.1',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, perferendis.' 
                }
            ]
        },
        {
            background: '//placehold.it/1000x1000/ff6600',
            title: 'Lorem ipsum dolor4.',
            top: '300',
            intros: [
                {
                    header: 'Lorem ipsum.1',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, perferendis.' 
                }
            ]
        },
        {
            background: '//placehold.it/1000x1000/ff6600',
            title: 'Lorem ipsum dolor5.',
            top: '300',
            intros: [
                {
                    header: 'Lorem ipsum.1',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, perferendis.' 
                }
            ]
        }
    ];

    var WEIBO_APP_KEY = "3080877242";

    var swapTimer;
    var swapTime = 0;
    var swapPercentage = 0;

    var $cover;
    var $cards;

    var $realtimePercengate;
    var $realtimeSeconds;
    var $gameResult;
    var $gamePercentage;
    var $shareResult;

    var scratch;
    var cardView;

    var cardViewInitialized;

    var totalSeconds;

    function whenReady() {
        $cover = $('#cover');
        $cards = $('#cards');

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

            initCardView();
        }
    }

    function showResult() {
        $gameResult.text(swapTime.toFixed(3) + 's');
        $gamePercentage.text((Math.random() * 100 >> 0) + '%');
        $('.game-result').addClass('game-result-show');
    }

    function initCardView() {
        var mapView, scene0;

        if (!cardViewInitialized) {
            cardViewInitialized = true;

            setTimeout(function() {
                mapView = $('#map-template').html();
                scene0 = buildSceneHtml(scenes[2]);

                // mapView = '<section class="card" id="map"></section>';
                // scene1 = '<section class="card"></section>';

                $cards.append(mapView).append(scene0);

                // _.each(scenes.slice(2), function(scene, index) {
                //     $cards.append(buildSceneHtml(scene));
                // });

                cardView = new CardView('#view', {
                    dataset: scenes,
                    onUpdateContent: updateContent
                });
            }, 0);
        }
    }

    function updateContent(el, data) {
        // el.id = cover | map | scene
        console.log(el.id);
    }

    function buildSceneHtml(scene) {
        return _.template($('#scene-template').html(), scene);
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