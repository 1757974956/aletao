$(function () {
    /*
    * 分析:
    * 1.渲染数据, 默认展示第一页
    * 2.分页展示
    * 3.点击添加分类弹窗
    * 4.点击确认按钮提交数据
    * */
    window.page = 1;

    // 1.渲染数据, 默认展示第一页
    var render = function () {
        getFirstData(function (data) {
            //使用模板引擎渲染数据
            $('tbody').html(template('list',data));
            //2.分页展示
            $(".pagination").bootstrapPaginator({
                //对应的bootstrap版本
                bootstrapMajorVersion:3,
                //分页按钮的大小
                size:'small',
                //对齐方式
                alignment:'right',
                //当前页码
                currentPage:window.page,
                //页码按钮的数量
                numberOfPages: 3,
                //设置总页数
                totalPages:Math.ceil(data.total/data.size),
                //提示信息
                tooltipTitles: function (type, page, current) {
                    //console.log(type, page, current)
                    switch(type){
                        case "first":
                            return "首页";
                        case 'last':
                            return "尾页";
                        case "prev":
                            return "上一页";
                        case 'next':
                            return "下一页";
                        case 'page':
                            return page;
                    }
                },
                //监听按钮的点击事件
                onPageClicked: function (event, originalEvent, type, page) {
                    //console.log(event, originalEvent, type, page)
                    window.page = page;
                    //重新渲染
                    render()
                }
            })
        })
    }
    render();

    //3.点击添加分类弹窗
    //校验
    $("#form").bootstrapValidator({
        /*根据验证结果显示的各种图标*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置需要校验的表单元素
        fields:{
            /*指定需要校验的元素  通过name数据去指定*/
            categoryName:{
                /*配置校验规则  规则不止一个*/
                validators:{
                    /*不能为空的校验规则*/
                    notEmpty:{
                        /*校验不成功的提示信息*/
                        message:'一级分类不能为空'
                    },
                    //匹配后台检验的规则
                    callback:{
                        /*校验不成功的提示信息*/
                        message:'用户名不存在'
                    }

                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        $.ajax({
            url:'/category/addTopCategory',
            type:'post',
            data:$(e.target).serialize(),
            dataType:'json',
            success: function (data) {
                if(data.success){
                    //关闭模态框
                    $('.box').modal('hide');
                    //渲染第一页
                    window.page = 1;
                    //重新渲染
                    render();
                    //重置表单
                    $(e.target).data('bootstrapValidator').resetForm();
                    $(e.target).find('input').val('');

                }

            }

        })
    })

})

var getFirstData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategoryPaging',
        type:'get',
        data:{
            page:window.page || 1,
            pageSize: 3
        },
        dataType:'json',
        success : function (data) {
            callback && callback(data)
        }
    })
}