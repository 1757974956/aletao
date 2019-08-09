$(function () {
    /*
    * 分析:
    * 1.获取历史记录, 从localstrong里面获取, 预设一个key值, 转化为json对象   JSON.parse()
    * 2.根据历史记录渲染列表   模板引擎
    * 3点击添加历史记录
    *   3.1非空校验
    *   3.2在正常的十条记录内是正常添加, 是倒循环
    *   3.3大于10条记录, 每添加一条, 删除最早的一条
    *   3.4判断如果有相同记录, 添加一条, 删除之前相同的一条
    * 4.点击删除历史记录
    * 5.点击清空历史记录
    * */

    //1.获取历史记录, 从localstrong里面获取, 预设一个key值, 转化为json对象   JSON.parse()
    var getHistory = function () {
        var str = localStorage.getItem("historyList") || '[]';
        var arr = JSON.parse(str);
        return arr;
    }
    var historyArr = getHistory();
    //2.根据历史记录渲染列表   模板引擎
    $('.lt_history').html(template('history',{list:historyArr}));

    //3点击添加历史记录
    $(".lt_search a").on('tap', function () {
        //获取关键字
        var key = $.trim($(".lt_search input").val());
        //3.1非空校验
        if(!key){
            mui.toast('请输入关键字')
            return;
        }
        /*
        * 3.2在正常的十条记录内是正常添加, 是倒循环
        *3.3大于10条记录, 每添加一条, 删除最早的一条
        *3.4判断如果有相同记录, 添加一条, 删除之前相同的一条*/

        var flag = false;
        var index;//记录相同的一条数据的索引
        for(var i = 0 ; i < historyArr.length ; i++){
            if(key == historyArr[i]){
                flag = true;//确定有相同记录
                 index = i;
            }
        }
        //如果有相同的记录
        if(flag){
            //添加一条, 删除之前相同的一条
            historyArr.push(key);
            historyArr.splice(index, 1);
        }else{
            if(historyArr.length < 10){
                //正常添加
                historyArr.push(key);
            }else{
                //每添加一条, 删除最早的一条
                historyArr.push(key);
                historyArr.splice(0, 1);
            }
        }
        //储存
        localStorage.setItem('historyList',JSON.stringify(historyArr));
        //跳转
        location.href = 'searchList.html?key='+key;
        // //渲染
        // $('.lt_history').html(template('history',{list:historyArr}));
        //
        // //清空输入框组
        // $(".lt_search input").val('');



    })
    //4.点击删除历史记录
    $(".lt_history").on('tap','.mui-icon-closeempty',function () {
        //4.1获取索引
        var index = $(this).attr('data-index');
        //4.2删除数据
        historyArr.splice(index, 1);
        //4.3重新储存数据
        //4.4重新渲染
        //储存
        localStorage.setItem('historyList',JSON.stringify(historyArr));
        //渲染
        $('.lt_history').html(template('history',{list:historyArr}));
    })

    //5.点击清空历史记录
    $(".lt_history").on('tap','.fa-trash', function () {
        localStorage.setItem('historyList','');
        //渲染
        $('.lt_history').html(template('history',{list:[]}));
    })

})