$(function () {
    window.LT = {};

    LT.getParams = function () {
        //假设地址栏的信息:searchList.html?key=1&name=shangsan
        //解码:  decodeURI(location.search)
        var search = decodeURI(location.search);  //输出: ?key=1&name=shangsan
        var params = {};//储存

        if(search){
            //先去掉问号
            search = search.replace("?",''); //key=1&name=shangsan&age=10
            //把& 分隔
            var arr =  search.split("&");
            arr.forEach(function (item, i) {
                var itemArr = item.split('=');
                //console.log(itemArr[0])
                params[itemArr[0]] = itemArr[1];// 通过键储存值
            })
            //console.log(arr)
        }
        return params;
    }
    LT.loginAjax = function (obj) {
        $.ajax({
            url:obj.url,
            type:obj.type,
            data:obj.data,
            dataType:obj.dataType,
            success:function (data) {
                console.log(data);
                // console.log(obj.error);
                if(data.error==400){
                    //跳转到登录页面
                    console.log(111);
                    location.href= "/myMobile/login.html?returnUrl= "+location.href;
                    return false;
                }else{
                    obj.success&&obj.success(data);
                }

            }
        })
    }
    LT.dataObj = function (data) {
        var obj = {};
        console.log(data);
        if(data){
            var arr = data.split("&")
            arr.forEach(function (item,index) {
                var itemArr =  item.split("=");
                obj[itemArr[0]]=itemArr[1];
            })
        }
        return obj;

    }

})