$(function () {
    /*
    * 1.默认渲染第一页
    * 2.分页展示
    * 3.点击添加分类的弹窗, 渲染一级分类的数据
    * 4.校验后, 点击确认按钮提交数据
    * */
    window.page = 1;
    //1.默认渲染第一页
    var render = function () {
        getSecondData(function (data) {
            console.log(data)
            //模板渲染
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
    //初始化
    render();

    //3.点击添加分类的弹窗, 渲染一级分类的数据
    getFirstData(function (data) {
        $(".dropdown-menu").html(template('firstData',data)).find('li').on('click', function () {
            //显示选中的分类名称
            var name = $(this).find('a').html();
            $(".name").html(decodeURI(name));
            //给隐藏域的表单赋值
            $('[name="categoryId"]').val($(this).find('a').attr("data-id"));

            //更改状态
            $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID')

        })
    })

    //3.上传图片
    initFile();

    //4.校验后, 点击确认按钮提交数据
    $("#form").bootstrapValidator({
        excluded:[],//默认指定不验证的情况, 让其为空
        /*根据验证结果显示的各种图标*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置需要校验的表单元素
        fields:{

            /*指定需要校验的元素  通过name数据去指定*/
            brandName:{
                /*配置校验规则  规则不止一个*/
                validators:{
                    /*不能为空的校验规则*/
                    notEmpty:{
                        /*校验不成功的提示信息*/
                        message:'请输入二级分类'
                    }

                }
            },
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'请选择一级分类名称'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请选择图片'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        //阻止默认事件
        e.preventDefault();
        console.log(decodeURI($(e.target).serialize()));//用序列化方法获取表单元素, 这是jQuery的方法
        //发送ajax请求
        $.ajax({
            url:'/category/addSecondCategory',
            type:'post',
            data:decodeURI($(e.target).serialize()),
            dataType:'json',
            success: function (data) {
                if(data.success){
                    //添加成功
                    $('.box').modal('hide');//隐藏模态框
                    window.page = 1;
                    render();
                    //重置表单
                    $("#form").data('bootstrapValidator').resetForm();

                }
            }
        })



    })










})

//二级分类的数据
var getSecondData = function (callback) {
    $.ajax({
        url:'/category/querySecondCategoryPaging',
        type:'get',
        data:{
            page:window.page || 1,
            pageSize:3,
        },
        dataType:'json',
        success: function (data) {
            callback && callback(data);
        }
    })

}

//一级分类的数据
var getFirstData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategoryPaging',
        type:'get',
        data:{
            page:window.page || 1,
            pageSize: 100
        },
        dataType:'json',
        success : function (data) {
            callback && callback(data)
        }
    })
}

//图片上传的数据
var initFile = function () {
    $('[type="file"]').fileupload({
        //返回的数据格式
        dataType:'json',
        url:'/category/addSecondCategoryPic',
        //上传完成之后的函数
        done: function (e, data) {
            console.log(data)
           var imgUrl =  data.result.picAddr;
            //设置隐藏域的值
            $('[name="brandLogo"]').val(data.result.picAddr)
            $(".myImg").attr('src',imgUrl);
            //更改状态
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID')
        }
    })
}