$(function () {
    //公共js模块

    //进度条
    NProgress.configure({
        showSpinner: false,//关闭进度环
    })
    //ajax开始请求时, 进度条显示
    $(window).ajaxStart(function () {
        NProgress.start();
    })
    //ajax请求完成时, 进度条走完
    $(window).ajaxComplete(function () {
        NProgress.done();
    })


    //二级菜单的显示和隐藏
    $('.menu [href="javascript:;"]').on('click', function () {
        $(this).siblings('.child').slideToggle();

    })

    //添加模态框 -->需要把html代码转化为字符串拼接  -->百度: 在线html转字符串
    var modelHtml = ['<div id="myModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">',
        '    <div class="modal-dialog modal-sm" role="document">',
        '        <div class="modal-content">',
        '            <div class="modal-header">',
        '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
        '                <h4 class="modal-title" id="myModalLabel">温馨提示</h4>',
        '            </div>',
        '            <div class="modal-body">',
        '               <p class="text-danger">您确定退出后台管理系统吗?</p>',
        '            </div>',
        '            <div class="modal-footer">',
        '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>',
        '                <button type="button" class="btn btn-primary">确定</button>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</div>'].join("");

    //添加到页面
    $('body').append(modelHtml);
    
    //点击显示模态框
    $('.glyphicon-log-out').on('click', function () {
        $('#myModal').modal().find('.btn-primary').on('click', function () {
            //发请求
            $.ajax({
                url:'/employee/employeeLogout',
                type:'get',
                data:'',
                dataType:'json',
                success: function (data) {
                    if(data.success){
                        //关闭模态框
                        $(".model").modal('hide');
                        //跳转到登录页
                        location.href = 'login.html';
                    }
                }
            })

        })
        
    })



})