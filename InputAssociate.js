$.extend({
	// 输入联想控件
    input_associate : function(assConfig) {
    
    	// 控件自定义配置
    	var selfConfig = {};
    		selfConfig.inputPlaceHolder = '关键字..';// 输入框提示文字
    		selfConfig.themeColor = "#0A9EE5";// 控件主题颜色
    		selfConfig.showStyle = "right";	// 控件的弹出方式，默认从右边弹出，目前支持right,left
    		
    	// 搜索历史本地存储键值--采用postUrl的md5
    	var assPanelStoreKey = hex_md5(assConfig.postUrl);
    		
    	if($("#assPanelId0000").length <= 0) {

			// 屏幕宽度高度
			var screenWidth = $(window).width();
			var screenHeight = $(window).height();
			
			// 热门搜索模板初始化（虚拟数据）
			var virtualSource = ['最热','热门搜索1','热门搜索2','热门搜索3','热门搜索(demo)'];
			var hotShowyn = virtualSource.length>0?"":"none";
			
			var assHotHistoryDiv =  "<div id='assHotHistoryDivId0000'>"+
			"<div id='assHotDivId0000' style='display:"+hotShowyn+"'>"+
				"<div style='padding:15px 0 0 15px;'>热门搜索</div>"+
				"<div style='padding:15px 15px 0 15px;overflow:hidden'>";
			for(var i=0;i<virtualSource.length;i++) {
				assHotHistoryDiv+="<a style='height:24px;line-height:24px;display:block;float:left;padding:0 10px;margin: 0 8px 8px 0;background-color:#F2F2F2;font-size:12px;white-space: nowrap;'"+
				" onclick='setDate(\""+assPanelStoreKey+"\",\""+virtualSource[i]+"\",\""+assConfig.inputObj+"\")'>"+virtualSource[i]+"</a>";
			}
			assHotHistoryDiv+="</div></div>";
			
			// 搜索历史模板初始化
			var storeArray = store.get(assPanelStoreKey);
			var historyShowyn = storeArray&&storeArray.length>0?"":"none";
			
			assHotHistoryDiv += 
			"<div id='assHistoryDivId0000' style='display:"+historyShowyn+"'>"+
				"<div style='padding:5px 0 15px 15px;'>搜索历史</div>"+
				"<ul data-role='listview' id='assHistoryListId0000'>";
					
			if(storeArray){
				assHotHistoryDiv += buildAssHistoryListHtml(assPanelStoreKey, assConfig.inputObj);
			}
			
			assHotHistoryDiv +=  "</ul>"+
			"<div style='text-align:center;padding:10px 0;'>"+
				"<a onclick='cleanAssHistory(\""+assPanelStoreKey+"\")' style='text-shadow:none;color:#fff;background-color:"+selfConfig.themeColor+"' class='ui-btn ui-mini ui-corner-all ui-btn-inline'>清除搜索历史</a>"+
			"</div></div></div>";
			
			// 联想控件页面模板初始化
	    	var assPanel =
	    	"<style>.ui-panel-inner {padding:0px;}</style>"+
	    	"<div data-role='panel' id='assPanelId0000' data-position='"+selfConfig.showStyle+"' data-swipe-close='false' data-dismissible='false' data-position-fixed='true' data-display='overlay' data-theme='a' style='display:none;width:"+screenWidth+"px;'>"+
				"<div style='background-color:"+selfConfig.themeColor+";width:100%;height:52px;position:fixed;z-index:99'>"+
					"<div style='padding:10px;height:32px;line-height:32px;'>"+
		    		"<div style='float:left;width:10%;' onclick='closeAssPanel()'>"+
		    			"<div style='text-align:center'><img style='margin:auto' src='img_ass_back.png'></div>"+
	    			"</div>"+
		    		"<div style='float:left;padding-left:1%;width:79%;'>"+
						"<input id='assSearchId0000' type='text' style='width:92%;height:28px;border:0px;padding:0 8px;' data-role='none' placeholder='"+selfConfig.inputPlaceHolder+"'>"+
				    "</div>"+
				    "<div style='float:left;width:10%;' onclick='closeAssPanel()'>"+
		    			"<div style='text-align:center'><img style='margin:auto' src='img_ass_search.png'></div>"+
	    			"</div>"+
	    			"</div>"+
		    	"</div>" +
	    		"<div style='height:"+screenHeight+"px;overflow-y:auto;'>"+
			    	"<div style='padding-top:54px;'>"+
						"<ul data-role='listview' id='assListId0000'></ul>"+
					"</div>"
					+ assHotHistoryDiv +
				"</div>"+
			"</div>";
			
	        $("#pageAssTest").append(assPanel);
        }
        
        // 调用控件input点击事件
    	var clickFn = function(event) {
    		$("#assSearchId0000").bind('input propertychange', keyupFn);
    		$("#assPanelId0000").css("display","");
    		$("#assPanelId0000").panel("open");
    		$("#assSearchId0000").val("");
    	};
    	
    	// 联想输入框输入事件
    	var keyupFn = function(event) {
			var obj = {};
			obj.inputObj = "#assSearchId0000";		// 目标输入框
			obj.showCnt = 10;						// 联想显示个数
			obj.url = "";							// 请求地址
			obj.minInterval = 200;					// 两次请求的最小间隔时间
			
		    var val = $(obj.inputObj).val();
		    if (val) {
		    	$("#assHotHistoryDivId0000").css("display","none");
		        var lastTime = $(obj.inputObj).data("htw_lastTime");	//最后请求数据的时间
		        var now = new Date().getTime();
		        lastTime = lastTime?lastTime:now;
		        var time = lastTime+obj.minInterval - now;
		        
		        if(time <= 0) { //超过最小间隔时间
		            $(obj.inputObj).data("htw_lastTime",now);
		            getData(val,obj);
		            
		        } else { //未超过最小间隔时间，就延迟请求
		            setTimeout(function(){
		                var val0 = $(obj.inputObj).val();
		                var now0 = new Date().getTime();
		                $(obj.inputObj).data("htw_lastTime",now0);
		                getData(val0,obj);
		            }, time);
		        }
		    } else {
		    	$("#assListId0000").html("");
		    	$("#assHotHistoryDivId0000").css("display","");
		    }
		};
		
		$("#"+assConfig.inputObj).click(clickFn);
    	
		function getData(val,obj){//请求数据
			var htmlStr = buildListHtml();
			$('#assListId0000').html(htmlStr);
			$("#assListId0000").listview("refresh");
		};
		
		// 构建联想结果html(虚拟数据)
		function buildListHtml(){
			var buff = [];
			buff.push(
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Acura","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Acura</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Audi","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Audi</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","BMW","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">BMW</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Cadillac","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Cadillac</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Ferrari","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Ferrari</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Acura2","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Acura2</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Audi2","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Audi2</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","BMW2","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">BMW2</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Cadillac2","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Cadillac2</li>'+
				'<li onclick=\'setDate("'+assPanelStoreKey+'","Ferrari2","'+assConfig.inputObj+'")\'><img src="img_ass_item.png" alt="" class="ui-li-icon">Ferrari2</li>'
			);
			return buff.join('');
		}
		
    }
});

// 给调用控件的输入框赋值
function setDate(key,value,input) {
	// input赋值
	$("#"+input).val(value);
	
	// 关闭搜索面板
	closeAssPanel();
	
	// 添加搜索历史
	addSearchHistory(key,value);
	
	// 刷新搜索历史div
	refreshAssHistoryDiv(key,input);
}

// 关闭联想面板
function closeAssPanel(){
	$('#assListId0000').html("");
	$("#assPanelId0000").panel("close");
	$("#assHotHistoryDivId0000").css("display","");
}

// 清空搜索历史
function cleanAssHistory(key) {
	store.remove(key);
	$("#assHistoryDivId0000").css("display","none");
}

// 重新加载搜索历史
function buildAssHistoryListHtml(key, input) {
	var htmlStr = "";
	var array = store.get(key);
	for(var i = 0; i < array.length; i++){
	    htmlStr += 
	    "<li style='color:grey'>"+
	    	"<div style='float:left;width:90%;' onclick='setDate(\""+key+"\",\""+array[i]+"\",\""+input+"\")'>"+
	    		array[i]+
    		"</div>"+
		    "<div style='float:right;'>"+
		    	"<img src='img_ass_delete.png' class='ui-li-icon' onclick='deleteAssHistoryItem(\""+key+"\",\""+array[i]+"\",\""+input+"\");'>"+
		    "</div>"+
	    "</li>";
	}
	return htmlStr;
}

// 刷新搜索历史div
function refreshAssHistoryDiv(key,input) {
	var storeArray = store.get(key);
	$("#assHistoryDivId0000").css("display","");
	$("#assHistoryListId0000").html("");
	var lis = buildAssHistoryListHtml(key, input);
	$("#assHistoryListId0000").html(lis);
	$("#assHistoryListId0000").listview("refresh");
}

// 单项删除搜索历史
function deleteAssHistoryItem(key,value,input) {
	deleteSearchHistory(key,value);
	refreshAssHistoryDiv(key,input);
	if(store.get(key).length==0){
		$("#assHistoryDivId0000").css("display","none");
	}
}

//----------------------------------搜索历史操作----------------------------------
// 添加
function addSearchHistory(key,value) {
	var oldArr = store.get(key);
	if(oldArr){
		for (var i = 0; i < oldArr.length; i++) {
			if (oldArr[i] === value) {
				oldArr.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
				break;
			}
		}
		oldArr.unshift(value); // 再添加到第一个位置
		store.set(key,oldArr);
	} else {
		var newArr = new Array();
		newArr.unshift(value);
		store.set(key,newArr);
	}
}

// 删除
function deleteSearchHistory(key, value) {
	var oldArr = store.get(key);
	if(oldArr){
		for (var i = 0; i < oldArr.length; i++) {
			if (oldArr[i] === value) {
				oldArr.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
				break;
			}
		}
		store.set(key,oldArr);
	} else {
		return false;
	}
}