$(function () {

    $(".btn").on("tap",function () {
        console.log($("form").serialize());
        var data = $("form").serialize();
        // console.log($(".users").html);
        var dataObj = function (data) {
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

        console.log(LT.dataObj(data));
        var form = LT.dataObj(data);
        if (!form.username){
            mui.toast("请输入用户名")
            return false;
        }
        if (!form.password){
            mui.toast("请输入密码")
            return false;
        }

        $.ajax({
            url:"/user/login",
            type:"post",
            data:form,
            dataType:"json",
            success:function (data) {
                console.log(data);
                if (data.error==403){
                    mui.toast(data.message)
                }else{
                    location.href= "/myMobile/个人中心.html?returnUrl= "+location.href;
                }
            }
        })


    })
    $(".zhuce").on("tap",function () {
        location.href="register.html";
    })

})