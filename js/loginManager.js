layui.use(['form', 'jquery', 'layer'], function () {
    var form = layui.form;
    var $ = layui.jquery
    var layer = layui.layer
    //监听提交
    form.on('submit(formDemo)', function (data) {
        $.ajax({
            url: 'http://localhost:8848/manger',
            type: 'GET',
            dataType: 'JSON',
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            data: data.field,
            success: function (res) {
                if(res.code == 200){
                    layer.msg(res.msg)
                    // window.location.href = "index.html";
                }else{
                    layer.msg(res.msg,{icon:2},function () {
                        changeCode();
                    })

                }

            }
        })
        return false;
    });
});

function changeCode(){
    var img = document.getElementById("codeImg");
    img.src = "http://localhost:8848/code?date="+new Date()
}