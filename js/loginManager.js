
var randId = new Date().getTime() + Math.floor(Math.random(9999999));
const uuid = randId;
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
                    window.location.href = "main.html";
                }else{
                    layer.msg(res.msg,{icon:2},function () {
                        changeCode();
                    })

                }

            }
        })
        return false;
    });

    document.getElementById('Uuid').value = uuid;
    
    $('#codeImg').attr('src',"http://localhost:8848/code?date="+new Date() + "&uuid=" + uuid);

});

function changeCode(){
    var img = document.getElementById("codeImg");
    img.src = "http://localhost:8848/code?date="+new Date()+"&uuid="+uuid;
}