$(function () {
    //初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
    });
    /*
    * 1.页面初始化时, 关键字在输入框内
    * 2.初始化完成之后, 根据关键字, 显示第一页的数据4条
    * 3.点击搜索的时候, 根据新的关键字搜索商品, 重新渲染
    * 4.点击排序的时候, 根据排序的选项, 重新排序, 并渲染
    * 5.当用户下拉要刷新, 重新排序
    * 6.当用户上拉要加载下一页的数据, 没有数据则提醒用户
    * */

    /*1.页面初始化时, 关键字在输入框内
    var getParams = function () {
        //假设地址栏的信息:searchList.html?key=1&name=shangsan
        var search = location.search;  //输出: ?key=1&name=shangsan
        var params = {};//储存

        if(search){
            //先去掉问号
            search = search.replace("?",''); //key=1&name=shangsan&age=10
            //把& 分隔
           var arr =  search.split("&");
           arr.forEach(function (item, i) {
               var itemArr = item.split('=');
               console.log(itemArr[0])
               params[itemArr[0]] = itemArr[1];// 通过键储存值
           })
            console.log(arr)
        }
        return params;
    }*/
    console.log(LT.getParams().key);
    var inputKey = $("input").val(LT.getParams().key || "");

   // 2.初始化完成之后, 根据关键字, 显示第一页的数据4条
   //  getData({
   //      proName: LT.getParams().key,
   //      page:1,
   //      pageSize:4,
   //  }, function (data) {
   //      console.log(data);
   //      //渲染数据
   //      $("#product_box").html(template('list',data));
   //  })

    //3.点击搜索的时候, 根据新的关键字搜索商品, 重新渲染
    $(".lt_search a").on('tap', function () {
        var key = $.trim(inputKey.val());
        if(!key){
            mui.toast("请输入关键字")
            return false;
        }
        getData({
            proName: key,
            page:1,
            pageSize:4,
        }, function (data) {
            console.log(data);
            //渲染数据
            $("#product_box").html(template('list',data));
        })
        //点击触发刷新的操作
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        // mui('#refreshContainer').pullRefresh().enablePullupToRefresh();
    })

    //4.点击排序的时候, 根据排序的选项, 重新排序, 并渲染
    $('.lt_orderBar a').on('tap', function () {
        //4.1改变当前的样式
        //判断是否选中, 有now这个样式
        if($(this).hasClass('now')){
            //更改箭头
            if($(this).children().hasClass('fa-angle-down')){
                $(this).children().removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                $(this).children().removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }else{
            $(this).addClass('now').siblings().removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down')
        }


        //4.2获取点击功能的类型 price 1升序 2降序.  默认四降序 . num也是
        var type= $(this).attr('data-type');
        var value = $(this).find('span').hasClass('fa-angle-up')? 1 : 2;
        console.log(type, value);

        var key = $.trim(inputKey.val());
        if(!key){
            mui.toast("请输入关键字")
            return false;
        }

        var params = {
            proName: key,
            page:1,
            pageSize:4,
        }
        //把所需要的参数追加到对象中
        params[type] = value;
        getData(params, function (data) {
            console.log(data);
            //渲染数据
            $("#product_box").html(template('list',data));
        })

    })

    //5.当用户下拉要刷新, 重新排序
    mui.init({
        pullRefresh : {
            //需要控制的容器
            container:"#refreshContainer",
            down : {
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function () {
                    var that = this;

                    var key = $.trim(inputKey.val());
                    if(!key){
                        mui.toast("请输入关键字");
                        that.endPulldownToRefresh();
                        return false;
                    }
                    getData({
                        proName: key,
                        page:1,
                        pageSize:4,
                    }, function (data) {
                        console.log(data);
                        setTimeout(function () {
                            //下拉刷新, 排序功能也要重置
                            $('.lt_orderBar a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down')
                            //渲染数据
                            $("#product_box").html(template('list',data));
                            //关闭下拉刷新的操作
                            that.endPulldownToRefresh();
                            //重新触发上拉加载的需求
                            that.refresh(true);
                        },1000)


                    })
                }
            },
           // 6.当用户上拉要加载下一页的数据, 没有数据则提醒用户
            up : {
                auto: true,
                callback :function () {
                    var that = this;
                    window.page++;
                    //4.2获取点击功能的类型 price 1升序 2降序.  默认四降序 . num也是
                    var type= $(this).attr('data-type');
                    var value = $(this).find('span').hasClass('fa-angle-up')? 1 : 2;
                    console.log(type, value);

                    var key = $.trim(inputKey.val());
                    if(!key){
                        mui.toast("请输入关键字")
                        return false;
                    }
                    var params = {
                        proName: key,
                        page:window.page,
                        pageSize:4,
                    }
                    //把所需要的参数追加到对象中
                    params[type] = value;
                    getData(params, function (data) {
                        console.log(data);
                        setTimeout(function () {
                            //追加数据
                            $("#product_box").append(template('list',data));
                            //如果data的data有数据, 就停止, 否则就在停止上拉的时候还提醒用户没数据了
                            if(data.data.length > 0){
                                that.endPullupToRefresh();
                            }else {
                                that.endPullupToRefresh(true);//若没有数据则传true
                            }
                        },1000)


                    })
                    
                }
            }
            
        }
    });

})

var getData = function (params, callback) {
    $.ajax({
        url:'/product/queryProduct',
        type:'get',
        data:params,
        dataType:'json',
        success : function (data) {
            console.log(data.page);
            window.page = data.page;
            callback && callback(data)
        }
    })
}
    
    
    
    
    
    
    
    
    
    
    