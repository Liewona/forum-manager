layui.use(['form', 'jquery', 'layer'], function () {
    var form = layui.form;
    var $ = layui.jquery;
    var layer = layui.layer;
    var password, passwords,account;
    $('#registe').on('click', function () {
        password = $('#password').val()
        passwords = $('#passwords').val()
        account = $('#account').val()
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
            data: JSON.stringify({
                account:account,
                password:password
            }),
            success: function (res) {
                if (res.code == 200) {
                    layer.msg(res.msg);
                    window.location.href = "/html/loginManager.html";
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