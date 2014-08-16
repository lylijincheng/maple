new function() {

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