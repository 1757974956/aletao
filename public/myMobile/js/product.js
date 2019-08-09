
$(function () {
    //1.获取关键字---->调用封装后的函数
    console.log(LT.getParams());
    var id = LT.getParams().productId;
     /*
    * 2.调接口(封装), 根据请求的数据渲染页面, 初始化区域滚动, 初始化轮播图
    * 3.尺码的选择, 数量的选择,
    * 4.点击加入购物车  校验数据--尺码, 数量
    * */
    getProductData(id,function (data) {
        console.log(id);
        //渲染商品详情页
        // console.log(model);
        $('.mui-scroll').html(template('productTpl',{model:data}));
        //初始化图片轮播
        mui('.mui-slider').slider({
            interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
        });
        //初始化区域滚动
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
        });

        //1.尺码的选择, 2.数量的选择 3, 加入购物车-->已经渲染完成, 再绑定事件是可以的
        $('.btn_size').on('tap',function () {
            $(this).addClass('now').siblings().removeClass('now');
        });
        //2.数量的选择
        $('.p_number span').on('tap',function(){
            //获取input框里面的值
            var num = $(this).siblings('input').val();
            console.log(num)
            //否则不能超过库存的时候---->获取自定义属性的值
            var MaxNum = parseInt($(this).siblings('input').attr('data-max'));
            //注意:数字被解析成字符串了, 转化成数字
            if($(this).hasClass('jian')){
                if(num == 0){
                    mui.toast('宝贝商品只能为正整数');
                    return false;
                }
                num--;
            }else{
                //否则不能超过库存
                //去html用自定义属性保存数据
                if(num >= MaxNum){
                    //需要做延时处理, 因为消息框在点击的时候会消失,正好和点击的事件一块消失
                    //处理移动端的兼容-->叫击穿 tap特有的
                    setTimeout(function(){
                        mui.toast('库存不足');
                    },100);
                    return false;
                }
                num++;
            }
            //把数量放进去
            $(this).siblings('input').val(num);
        });
        //3.加入购物车
        $('.btn_addCart').on('tap',function () {
            //验证数据
            // console.log($(".btn_size.now").innerText);
            var $changeBtn = $('.btn_size.now');
            console.log($changeBtn);
            if(!$changeBtn.length){
                mui.toast('请您选择尺码');
                return false;
            }
            //获取数量的值
            var num = $('.p_number input').val();
            if(num <= 0 ){
                mui.toast('请您选择数量');
                return false;
            }
            LT.loginAjax({
                url:"/cart/addCart",
                type:"post",
                dataType:"json",
                data:{
                    productId:id,
                    num:num,
                    size:$(".btn_size.now").html()
                },
               success:function (data) {
                   if(data.success==true){
                           var btnArray = ['是', '否'];
                           mui.confirm('添加成功,是否去看看', '温馨提示', btnArray, function(e) {
                               if (e.index == 0) {
                                   location.href="/myMobile/购物车.html?returnUrl="+location.href;
                               } else {
                               }
                           })
                       // console.log(111);
                       // location.href="/myMobile/购物车.html?returnUrl="+location.href;
                       // return false;
                   }
               }
            })
        })
    })
});
//通过ajax加载数据-->把商品详情的id要传过去
var getProductData = function(productId,callback){
    $.ajax({
        type:'get',
        url:'/product/queryProductDetail',
        data:{id:productId},
        dataType:'json',
        success:function(data){
            console.log(data.pic);
            console.log(data);
            callback && callback(data);
        },

    })
};
