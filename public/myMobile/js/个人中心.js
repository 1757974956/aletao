$(function () {

    getName(function (data) {
    $('#li').html(template('phone',{list:data}));
})
    
    $(".lt-btn").on("tap",function () {

        console.log(111);

        $.ajax({
            url:"/user/logout",
            type:"get",
            dataType:"json",
            success:function (data) {
                console.log(data);
                if (data.success==true){
                    location.href="login.html";
                }
            }
        })
    })
    

})
var getName=function(callback){
    $.ajax({
        url:"/user/queryUserMessage",
        type:"get",
        dataType:"json",
        success:function (data) {
            console.log(data);
            callback&&callback(data);
        }
    })
}





