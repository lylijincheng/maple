window.USER_ACCESS_TOKEN = "";
window.MSTIME = 0;
window.PERCENTAGE = 0;

function r_init_share_background(filepath)
{
	var cssBox = jQuery("#weibo_css_box");
    cssBox.remove();
    cssBox = jQuery(document.createElement("div"));
    jQuery(document.body).append(cssBox);
    cssBox.attr("id", "weibo_css_box");
    cssBox.html('<style type="text/css">.WB_imgHolder { background:url('+filepath+')!important;background-size:80px!important; } .WB_imgHolder img { visibility:hidden; } .WB_textarea{height:80px!important;width:363px!important;} </style>');
}

function showRemoteResult()
{
    $('#full-mask').children('.focus-container').append($('#prize-result-template').html());
    $('#full-mask').removeClass('hidden');
}

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

function r_get_rank(mstotaltime)
{
	window.MSTIME = mstotaltime;
    window.PERCENTAGE = 50;
    r_init_share_button(mstotaltime, window.PERCENTAGE, showRemoteResult);
	jQuery.ajax({
        "url":"index.php?action=share.rank",
        "dataType":"json",
        "data":{ "time":mstotaltime},
        "success":function (response) {
            setTimeout(function () {
            	var percentage = 90;
                if (response.code == 200) {
                	percentage = response.data.rank;
                }
                window.PERCENTAGE = percentage;
                $('#remote-percentage').text(percentage);
                r_init_share_button(mstotaltime, percentage, showRemoteResult);
            }, 1000);
            
        },
        "error":function () {
            $('#remote-percentage').text(90);
        }
    });
}

function r_submit_result(uid, name, avatar, ulink, ufriendc, wbid, mstotaltime, callback) {
    jQuery.ajax({
        "url":"index.php?action=share.submit",
        "dataType":"json",
        "data":{ "wid":wbid, "uid":uid, "name":name, "avatar":avatar, "ulink":ulink, "ufriendc":ufriendc,"mstime":mstotaltime }
    }).always(function() {
        callback();
    });
}

function r_init_share_button(mstime, rank, callback) {
	
    var picUrl = "http://ontariotravel.cn/2014fallcampaign/images/haibao.jpg";
    /*
    if($("#scratch-background-img") != null && $("#scratch-background-img") !='undefined'){
        picUrl = "http://ontariotravel.cn/2014fallcampaign/" + $("#scratch-background-img").attr("src");
    }
    */
    r_init_share_background(picUrl);
	wb_init_pc_share_btn("share-button", "#枫狂黄金周#我用"+ mstime / 1000.0 +"秒扫完枫叶，快过了"+ rank+"%的人, @安大略省旅游局微博，加拿大安大略省秋季枫情美景，你也来体验吧！http://www.ontariotravel.cn/2014fallcampaign", [picUrl], function (success, uid, name, avatar, ulink, ufriendc, wbid) {
        if (success) {
            //抽奖
             r_submit_result(uid, name, avatar, ulink, ufriendc, wbid, mstime, callback);   
        }
	});

};