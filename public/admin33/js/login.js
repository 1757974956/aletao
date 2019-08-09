$(function () {
    //初始化校验插件
    /*
    * 条件:必须是form表单结构, 并且有一个提交按钮  submit
    *
    * */
    $('#login').bootstrapValidator({
        //指的是没有错误提示的时候,默认用这个提示
        //message: 'This value is not valid',
        //配置校验不同状态下显示的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'//验证时显示的图标
        },
        //需要校验的表单元素, 通过name名校验
        fields: {
            //对应表单元素的name名
            username: {
                //也是校验的默认提示,不会配置默认的
                message: '用户名验证失败',
                //会用我们自定义的校验规则,会有多个校验规则
                validators: {
                    //不能为空的校验规则
                    notEmpty: {
                        message: '请输入用户名'
                    },
                    //自定义校验规则--->供后台校验失败的
                    callback:{
                        message:'用户名不存在'
                    }
                }

            },
            password:{
                validators:{
                    ////不能为空
                    notEmpty:{
                        message:"请输入密码"
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '密码长度必须在6到18位之间'
                    },
                    //自定义校验规则--->供后台校验失败的
                    callback:{
                        message:'密码错误'
                    }
                }
            }
        },
        //校验成功之后触发提交事件
    }).on('success.form.bv', function (e) {
        //要阻止submit的默认跳转事件, 因为我们要用ajax提交
        e.preventDefault();
        //alert(11)//测试,成功后就要需要后台校验用户名和密码了
        //需要拿到form表单中的表单值, 就要用到一个序列化方法,是jquery方法
        console.log(e.target);
        var $form = $(e.target).serialize();
        console.log($form);

        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data:$form,
            dataType:'json',
            //解决中文乱码
            // contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success:function(data){
                //还要判断业务上是否成功
                if(data.success == true){
                    //跳转后台的首页
                    location.href = '/admin/index.html'
                }else{
                    //后台校验失败,即业务失败
                    if(data.error == 1000){
                        //用户名错误
                        //设置用户名校验失败的状态
                        /*在表单中有四种状态: NOT_VALIDATED 还没校验, VALIDATING 校验中, INVALID 失败 or VALID 成功*/
                        //1.获取校验的组件-->调用更改状态的函数,三个参数 : 1.校验的表单,2改成什么状态,3.使用哪个校验规则
                        $(e.target).data('bootstrapValidator').updateStatus('username','INVALID','callback');
                        //可以自定义新的校验规则-->callback
                    }else if(data.error == 1001){
                        //密码错误--?//设置密码校验失败的状态
                        $(e.target).data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
            }
        });

    });

});