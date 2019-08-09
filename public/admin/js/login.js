$(function () {
    /*
    * 1.表单验证插件 :  bootstrapValidator.js
    * 2.导入相关文件
    * 3.使用插件的条件: 必须要用name属性, 必须要用submit提交按钮, 有完整的表单结构form
    * 4.初始化表单验证的组件, 配置一些相关的功能
    * */
    $("#login").bootstrapValidator({
        /*根据验证结果显示的各种图标*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置需要校验的表单元素
        fields:{
            /*指定需要校验的元素  通过name数据去指定*/
            username:{
                /*配置校验规则  规则不止一个*/
                validators:{
                    /*不能为空的校验规则*/
                    notEmpty:{
                        /*校验不成功的提示信息*/
                        message:'请您输入用户名'
                    },
                    //匹配后台检验的规则
                    callback:{
                        /*校验不成功的提示信息*/
                        message:'用户名不存在'
                    }

                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'请您输入密码'
                    },
                    stringLength:{
                        min:6,
                        max:18,
                        message:'密码6-18个字符'
                    },
                    //匹配后台检验的规则
                    callback:{
                        /*校验不成功的提示信息*/
                        message:'密码错误'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        //阻止默认事件
        e.preventDefault();
        console.log($(e.target).serialize());//用序列化方法获取表单元素, 这是jQuery的方法
        //发送ajax请求
        $.ajax({
            url:'/employee/employeeLogin',
            type:'post',
            data:$(e.target).serialize(),
            dataType:'json',
            success : function (data) {
                //当用户名不存在
                if(data.error == 1000){
                    //设置用户名校验失败的状态
                    /*调用校验插件  让该选项置为 校验失败状态 提示校验失败的信息*/
                    /*updateStatus(‘哪个元素’，‘修改什么状态’，‘校验规则’)*/
                    /*校验状态：未校验 NOT_VALIDATED 正在校验 VALIDATING  校验成功 VALID 校验失败 INVALID */
                    $(e.target).data('bootstrapValidator').updateStatus('username','INVALID','callback')
                }else if(data.error == 1001){
                    //设置密码校验失败的状态
                    $(e.target).data('bootstrapValidator').updateStatus('password','INVALID','callback')

                }else if(data.success == true){
                    location.href = 'index.html';

                }


            }
        })

    })

    //点击重置功能
    $('[type="reset"]').on('click', function () {
        $("#login").data('bootstrapValidator').resetForm();

    })


})