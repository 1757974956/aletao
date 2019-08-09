$(function () {

    /*导入picker组件的样式和js ,点击地址框,显示城市列表选择
    * 若地址有传值 ,则修改地址否则添加地址标题
    * 点击获取一系列的值,校验后提交,判断参数,有则修改url 反之添加url地址
    *
    *
    *
    * */

    //初始化组件
    var newPicker = new mui.PopPicker({
        layer:3
    })
    newPicker.setData(cityData);
    $("[name='address']").on("tap",function () {
        newPicker.show(function (item) {
            console.log(item);
            if (item[0].text==item[1].text) {
                item[0].text="";
            }
            $("[name='address']").val(item[0].text+item[1].text+item[2].text)
        })
    })

    console.log(LT.getParams().addressId);
    var addressId = LT.getParams().addressId;
    if (addressId){
        $(".lt_header h4").html("修改收货地址");
        getAddress(function (data) {
            // console.log(data);
            var obj={};
            for(var i=0;i<data.length;i++){
                if (addressId==data[i].id){
                    //获取对应id的数据
                    obj=data[i];
                    break;
                }
            }
            $("[name='recipients']").val(obj.recipients)
            $('[name="postcode"]').val(obj.postCode)
            $("[name='address']").val(obj.address)
            $("[name='addressDetail']").val(obj.addressDetail)
        })
    } else{
        $(".lt_header h4").html("添加收货地址");
    }

    $(".btn_submit").on("tap",function () {
        //条件form表单和name属性
        console.log(LT.dataObj(decodeURI($('.form_box').serialize())));
        var data = LT.dataObj(decodeURI($('.form_box').serialize()));
            if(!data.recipients){
                mui.toast("请输入收件人")
                return false;

            }
           if(!data.postCode){
               mui.toast("请输入邮编")
               return false;

        }
           if(!data.address){
               mui.toast("请输入收货地址")
               return false;

           }
           if(!data.addressDetail){
               mui.toast("请输入详细地址")
               return false;
        }
        var url = "/address/addAddress";
            var html="添加"
            if(addressId){
                url = "/address/updateAddress";
                html="修改"
            }
            data.id=addressId;
        editAddress(url,data,function (data) {
            console.log(data);
            if(data.success){
                mui.toast(html+"成功");
                location.href="address.html"
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
var editAddress = function (url,data,callback) {
    LT.loginAjax({
        url:"/address/addAddress",
        type:"post",
        data:data,
        dataType:"json",
        success:function (data) {
            callback&&callback(data)
        }
    })
}





