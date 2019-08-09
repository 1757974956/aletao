$(function () {

    //初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        //deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    //调用一级分类的数据
    getFirstCategory(function (data) {
        //隐藏加载的效果
        console.log(data)
        //1.渲染一级分类 : 模板引擎使用的步骤: 引入, 准备数据, 定义模板, 调用模板, 渲染页面
        var html = template('first',data);
        $(".left ul").html(html);


        //2.渲染对应的二级分类
        var categoryId = $(".left ul").find("a").attr("data-id");
        getSecCategory({id:categoryId}, function (data) {
            $(".right ul").html(template('second',data));

        })

    })


    //点击一级分类渲染对应的为二级分类  : 委托事件
    $(".left").on("tap",'a', function () {
        if( $(this).parent().hasClass('now')) return;
        //获取对应的id
        var categoryId = $(this).attr("data-id");

        //先去掉所有li的样式
        $(".left li").removeClass('now');
        //给对应的加上now
        $(this).parent().addClass('now');

        getSecCategory({id:categoryId}, function (data) {
            console.log(data)
            $(".right ul").html(template('second',data));

        })

    })
})

//封装一级分类的数据: 数据是数据, 业务是业务
var getFirstCategory = function (callback) {
    //1.一级分类的数据
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        datatype:'json',
        success: function (data) {
            //实现业务逻辑
            callback && callback(data)
        }
    })
}

//二级分类的数据   params = {id: 3}
var getSecCategory = function (params, callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data: params,
        dataType:'json',
        success: function (data) {
            callback && callback(data)
        }
    })
}