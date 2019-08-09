$(function () {
//渲染
getAddress(function (data) {
    $(".mui-table-view").html(template("address",{list:data}))
});

$(".mui-table-view").on("tap",".mui-btn-red",function () {
   delAddress($(this).attr("data-id"),function (data) {
       if(data.success){
           getAddress(function (data) {
               $(".mui-table-view").html(template("address",{list:data}))
           });
       }
   })


})


})

var getAddress = function (callback) {
    LT.loginAjax({
        url:"/address/queryAddress",
        type:"get",
        dataType:"json",
        success:function (data) {
            console.log(data);
            callback&&callback(data)
        }
})

}
var delAddress=function (id,callback) {
    LT.loginAjax({
        type:"post",
        url:"/address/deleteAddress",
        data:{id:id},
        dataType:"json",
        success:function (data) {
            console.log(data);
            callback&&callback(data)
        }
    })
}
