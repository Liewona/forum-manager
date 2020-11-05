layui.use(['form', 'jquery', 'layer'], function () {
    var form = layui.form;
    var $ = layui.jquery;
    var layer = layui.layer;
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });
    var password, passwords,account,uname,sex;
    $('#registe').on('click', function () {
        password = $('#password').val()
        passwords = $('#passwords').val()
        account = $('#account').val()
        uname = $('#uname').val()
        sex = $("input[type='radio']:checked").val()
        console.log(password + "\t" + passwords);
        if (password != passwords) {
            layer.msg("密码不一致");
            return;
        }
        $.ajax({
            url: 'http://localhost:8848/regist/',
            dataType: "JSON",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            data: JSON.stringify({
                username:account,
                password:password,
                uname:uname,
                sex:sex
            }),
            success: function (res) {
                if (res.code == 200) {
                    layer.msg(res.msg);
                    window.location.href = "/html/loginUser.html";
                } else {
                    layer.msg(res.msg);
                    console.log(res.msg)
                }
            }
        });

    })
    $('#reset').on('click', function () {
        document.getElementById('account').value = ""
        document.getElementById('password').value = ""
        document.getElementById('passwords').value = ""
    })
});