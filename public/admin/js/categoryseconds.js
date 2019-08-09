$(function () {
    /*
    * 默认显示第一页
    * 分页展示
    * 点击添加分类弹框,渲染一级分类
    *
    * */

    var rander = function () {
        getSecond(function (data) {
            $("tbody").html(template("list",data))
            // 分页展示
            $(".pagination").bootstrapPaginator({
                bootstrapMajorVersion:3,
                //分页按钮的大小
                size:"small",
                //对齐方式
                alignment:"center",
                //当前页码
                currentPage:window.page,
                //页码按钮的数量
                numberOfPages:3,
                //设置总页数
                totalPages:Math.ceil(data.total/data.size),
                tooltipTitles:function (type,page,current) {
                    switch (type) {
                        case"first":
                            return'首页';
                        // break;
                        case"last":
                            return"尾页";
                        // break;
                        case"prev":
                            return'上一页';
                        // break;
                        case"next":
                            return"下一页";
                            // break;
                            return page;
                    }
                },
                //监听按钮的点击事件
                onPageClicked:function (event,originalEvent,type,page) {
                    window.page=page;
                    rander();
                }
            })
        })

    }
    rander();
    getCategoryFirstData(function (data) {
        $(".dropdown-menu").html(template("first",data)).find("li").on("click",function () {
            var name= $(this).find("a").html();
            $(".name").html(name);
            $("[name='categoryI']").val($(this));
        })
    })

    
})

var getSecond = function (callback) {
    $.ajax({
        url:"/category/querySecondCategoryPaging",
        type:"get",
        data:{
            page:1,
            pageSize:100,
        },
        dataType:"json",
        success:function (data) {
            console.log(data);
            callback&&callback(data)
        }
    })
}
var getCategoryFirstData = function (params, callback) {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategoryPaging',
        data: params,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);

        }
    });
}

var initFile = function () {
    $("[type='file']").fileupload({
        dataType:"json",
        url:"/category/addSecondCategoryPic",
        done:function (e,data) {
            console.log(data);
            data.result.picAddr;
            $(".myImg").attr("src",imgUrl);
        }
    })
}


