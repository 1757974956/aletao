$(function () {
    /*初始化页面自动下拉刷新
    点击刷新按钮重新刷新
    侧滑时点击删除弹出对话框
    侧滑时点击编辑弹出对话框,修改尺码或数量
    点击复选框,计算金额
    * */

    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        //deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    mui.init({
        pullRefresh : {
            //需要控制的容器
            container:"#refreshContainer",
            down : {
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function () {

                    var that = this;

                    setTimeout(function () {
                        //关闭下拉刷新的操作

                        getCar(function (data) {
                            $(".mui-table-view").html(template("cart",data))
                        })

                        that.endPulldownToRefresh();

                        //重新触发上拉加载的需求
                        // that.refresh(true);
                    },1000)
                }
            },
        }
    });
    $(".fa-refresh").on("tap",function () {
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        $("#cartAmount")
    })
    //侧滑
    $(".mui-table-view").on("tap",".mui-btn-danger",function () {
        var $li=$(this).parent().parent()[0];//用原生js对象
        //获取id
        var id = $(this).attr("data-id")
        mui.confirm('是否确定删除该商品', '商品删除',['是', '否'], function(e) {
            if (e.index == 0) {
                // location.href="/myMobile/购物车.html?returnUrl="+location.href;
                //删除对应的商品
                LT.loginAjax({
                    url:"/cart/deleteCart",
                    type:"get",
                    data:{id:id},
                    dataType:"json",
                    success:function (data) {
                        console.log(data);
                        if (data.success==true){
                            //删除成功-->删除数据库的数据
                            //删除页面
                            $($li).remove();
                            setMoney();
                        }
                    }
                })


            } else {
                //关闭侧滑, 关闭对应的li
                mui.swipeoutClose($li);
            }
        })
    })
    $(".mui-table-view").on("tap",".mui-btn-primary",function () {
        // var id = $(this).attr("data-id");
        var $li=$(this).parent().parent()[0];//用原生js对象
        //获取自定义属性的集合

        var item =this.dataset;//key值自动转化成小写
        console.log(item);//obj
        //使用模板引擎
        var html = template("edit",item)//返回html的字符串
        console.log(html);
        mui.confirm(html.replace(/\n/g,""), '商品编辑',['是', '否'], function(e) {
            if (e.index == 0) {
                // location.href="/myMobile/购物车.html?returnUrl="+location.href;
                //删除对应的商品
                var size = $(".btn_size.now").html();
                var num = $(".p_number input").val();

                LT.loginAjax({
                    url:"/cart/updateCart",
                    type:"post",
                    data:{
                        id:item.id,
                        size:size,
                        num:num
                    },
                    dataType:"json",
                    success:function (data) {
                        console.log(data);
                        if(data.success){
                            item.size=size;
                            item.num=num;
                            $($li).find(".size").html(size+"鞋码");
                            $($li).find(".mui-pull-right").html(num+"双");
                            mui.swipeoutClose($li);
                            setMoney(item.num);
                        }
                    }
                })



            } else {
                //关闭侧滑, 关闭对应的li
                mui.swipeoutClose($li);
            }
        })
    })
    $('body').on('tap' ,".btn_size",function () {
        console.log(1111);
        $(this).addClass('now').siblings().removeClass('now');
    });
    //2.数量的选择
    $('body').on('tap' ,".p_number span",function(){
        //获取input框里面的值
        var num = $(this).siblings('input').val();
        // console.log(num)
        //否则不能超过库存的时候---->获取自定义属性的值
        var MaxNum = parseInt($(this).siblings('input').attr('data-max'));
        //注意:数字被解析成字符串了, 转化成数字
        if($(this).hasClass('jian')){
            if(num == 1){
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




    $(".mui-table-view").on("change","[type='checkbox']",function () {
        //选中的每一个数*单价
        setMoney();

    })





})

var getCar = function (callback) {
    LT.loginAjax({
        url:"/cart/queryCartPaging",
        type:"get",
        data:{
            page:1,
            pageSize:100,
        },
        dataType:"json",
        success:function (data) {
            console.log(data);
            // console.log(data.price);
            callback&&callback(data)
        }
    })

}

var setMoney = function (editNum) {
    var $checkBox = $("[type='checkbox']:checked")
    // console.log($checkBox);
    var totle = 0;
    $checkBox.each(function (item ,i) {
        var num =editNum|| $(this).attr("data-num");
        var price = $(this).attr("data-price");
        totle += num*price;
    })
    // console.log(totle);
    totle = Math.floor(totle*100)/100;
    $("#cartAmount").html(totle);
}



