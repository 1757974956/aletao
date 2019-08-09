$(function () {

  getUser(function (data) {
    $("tbody").html(template("phone",data));
})


})

var getUser = function (callback) {
    $.ajax({
        url:"/user/queryUser",
        type:'get',
        data:{
            page:window.page||1,
            pageSize:1,
        },
        dataType:"json",
        success:function (data) {
            console.log(data);
            callback&&callback(data)
        }
    })
}
