function wb_short_url(url, callback) {
	WB2.login(function(){
		WB2.anyWhere(function(W){
			W.parseCMD("/short_url/shorten.json", 
				function (result, status) {
					if (status == true) {
						callback(true, result.urls[0].url_short);
					}
					else {
						callback(false, null);
					}
				}, 
				{
					"url_long":url
				},
				{
					"method":"post"
				});
		});
	});
}

function wb_status_count(weiboid, callback) {
	WB2.login(function(){
		WB2.anyWhere(function(W){
			W.parseCMD("/statuses/count.json", 
				function (result, status) {
					if (status == true) {
						callback(true,result[0].id, result[0].comments, result[0].reposts);
					}
					else {
						callback(false, 0, 0, 0);
					}
				}, 
				{
					"ids":weiboid
				},
				{
					"method":"get"
				});
		});
	});
}

function wb_querymid_count(weiboid, callback) {
	WB2.login(function(){
		WB2.anyWhere(function(W){
			W.parseCMD("/statuses/querymid.json", 
				function (result, status) {
					if (status == true) {
						callback(true,weiboid, result.mid);
					}
					else {
						callback(false, 0, 0);
					}
				}, 
				{
					"id":weiboid,
					"type":"1"
				},
				{
					"method":"get"
				});
		});
	});
}

function wb_querymid_count_batch(weiboids, callback) {
	//注：此处不需要登录
	WB2.anyWhere(function(W){
		W.parseCMD("/statuses/querymid.json", 
			function (result, status) {
				if (status == true) {
					callback(true,result);
				}
				else {
					callback(false, 0);
				}
			}, 
			{
				"id":(typeof(weiboids) == "object") ? weiboids.join(",") : weiboids,
				"type":"1",
				"is_batch": "1"
			},
			{
				"method":"get"
			});
	});
}

function wb_metadata_info(weiboid, callback) {
	WB2.login(function(){
		WB2.anyWhere(function(W){
			W.parseCMD("/statuses/show.json", 
				function (result, status) {
					if (status == true) {
						callback(true, weiboid, result.text, result.bmiddle_pic, result.comments_count, result.reposts_count);
					}
					else {
						callback(false, weiboid, "", "", 0, 0);
					}
				}, 
				{
					"id":weiboid
				},
				{
					"method":"get"
				});
		});
	});
}

function wb_metadata_info_batch(weiboids, callback) {
	//注：此处不需要登录即可获取
	WB2.anyWhere(function(W){
		W.parseCMD("/statuses/show_batch.json", 
			function (result, status) {
				if (status == true) {
					callback(true, result);
				}
				else {
					callback(false, result);
				}
			}, 
			{
				"ids":(typeof(weiboids) == "object") ? weiboids.join(",") : weiboids,
			},
			{
				"method":"get"
			});
	});
}

function wb_count_url_shares(url, callback) {
	WB2.login(function(){
		wb_short_url(url, function (success, shortUrl) {
			WB2.anyWhere(function(W){
				W.parseCMD("/short_url/share/counts.json", 
					function (result, status) {
						if (status == true) {
							callback(true, parseInt(result.urls[0].share_counts));
						}
						else {
							callback(false, 0);
						}
					}, 
					{
						"url_short":shortUrl
					},
					{
						"method":"post"
					});
			});
		});
	});
}

function wb_count_url_comments(url, callback) {
	WB2.login(function(){
		wb_short_url(url, function (success, shortUrl) {
			WB2.anyWhere(function(W){
				W.parseCMD("/short_url/comment/counts.json", 
					function (result, status) {
						if (status == true) {
							callback(true, parseInt(result.urls[0].comment_counts));
						}
						else {
							callback(false, 0);
						}
					}, 
					{
						"url_short":shortUrl
					},
					{
						"method":"post"
					});
			});
		});
	});
}

function wb_init_share_btn(btnId, text, photos, callback) {
	var weiboframe = $("#sina_anywhere_iframe");

	if(weiboframe.length > 0){
		$("#sina_anywhere_iframe").remove();
	}

	var publishbox = $(".WB_publishBox");
	if(publishbox.length > 0){
		$(".WB_publishBox").remove();
	}

	WB2.anyWhere(function(W){
	    W.widget.publish({
	        action:"",
	        type:"mobile",
	        language:"zh_cn",
	        toolbar:"face,image,topic",
	        button_type:"red",
	        button_size:"middle",
	        default_text:text,
	        default_image: (typeof(photos) == "object") ? photos.join(",") : photos, 
	        refer:"y",
	        appkey:"2896045710",
	        id:btnId,
	        "callback": function (response) {
	        	if (typeof(callback) == "function") {
	        		if (response.status) {
	        			callback(true, response.result.data.user.idstr, response.result.data.user.screen_name, response.result.data.user.profile_image_url, response.result.data.user.profile_url, response.result.data.user.friends_count, response.result.data.idstr);
	        		}
	        		else {
	        			callback(false, response);
	        		}
	        	}
	        }
	    });
	});

}

function wb_init_pc_share_btn(btnId, text, photos, callback) {
	var weiboframe = $("#sina_anywhere_frame");

	if(weiboframe.length > 0){
		$("#sina_anywhere_frame").remove();
	}

	WB2.anyWhere(function(W){
	    W.widget.publish({
	        action:"",
	        type:"",
	        language:"zh_cn",
	        toolbar:"face,image,topic",
	        button_type:"red",
	        button_size:"middle",
	        default_text:text,
	        default_image: (typeof(photos) == "object") ? photos.join(",") : photos, 
	        refer:"y",
	        appkey:"",
	        id:btnId,
	        "callback": function (response) {
	        	if (typeof(callback) == "function") {
	        		if (response.status) {
	        			callback(true, response.result.data.user.idstr, response.result.data.user.screen_name, response.result.data.user.profile_image_url, response.result.data.user.profile_url, response.result.data.user.friends_count, response.result.data.idstr);
	        		}
	        		else {
	        			callback(false);
	        		}
	        	}
	        }
	    });
	});
}

function wb_login(callback){
	WB2.login(function(){
			WB2.anyWhere(function(W){
				W.parseCMD('/account/get_uid.json', function(oResult, bStatus){
					if(bStatus){
						if (typeof(callback) == 'function'){
							callback(true, oResult.uid);
						}
					}
				},
				{},
				{
					method:'get'
				});
			});
	});
}

function wb_check_login() {
	return WB2.checkLogin();
}

function wb_get_user_with_uid(uid, callback) {
	WB2.login(function(){
		WB2.anyWhere(function(W){
			W.parseCMD('/users/show.json', function(oResult, bStatus){
				if(bStatus){
					if (typeof(callback) == 'function'){
						callback(true, oResult)
					}
				}
			},
			{ "uid":uid },
			{
				method:'get'
			});
		});
	});
}