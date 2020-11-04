var table;
layui.use(['table', 'jquery', 'layer'], function () {
    table = layui.table;
    var $ = layui.jquery
    var layer = layui.layer

    table.render({
        elem: '#tabUser',
        height: 460,
        url: 'http://localhost:8848/user/',
        title: '用户管理',
        page: true //开启分页--会在地址后面自动添加?page=1&limit=10
            ,
        toolbar: '#headBar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,
        cols: [
            [ //表头
                {
                    type: 'checkbox',
                    fixed: 'left'
                }, {
                    field: 'username',
                    title: '账号',
                }, {
                    field: 'uname',
                    title: '昵称',
                    edit: 'text'
                }, {
                    field: 'phone',
                    title: '电话',
                    edit: 'text'
                }, {
                    field: 'registerTime',
                    title: '注册时间',
                }, {
                    field: 'age',
                    title: '年龄',
                    sort: true,
                    edit: 'text'

                }, {
                    field: 'sex',
                    title: '性别',
                    //edit: 'text'
                }, {
                    field: 'img',
                    title: '头像',
                    templet: function (res) {
                        return '<img src="' + res.img + '"class="layui-nav-img">'
                    }
                }, {
                    fixed: 'right',
                    width: 165,
                    align: 'center',
                    toolbar: '#toolUser'
                }
            ]
        ]
    });

    $("#search").on('click', function () {
        //执行重载
        table.reload('tabUser', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                "uname": $("#uname").val(),
                "phone": $("#phone").val()
            },
            url: "http://localhost:8848/user/like"
        });
    })

    table.on('toolbar(tabUser)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id),
            data = checkStatus.data; //获取选中的数据
        switch (obj.event) {
            case 'add':
                layer.open({
                    type: 2,
                    title: "添加用户",
                    area: ["500px", "500px"],
                    content: "/html/userManager/addUser.html"
                })
                break;
            case 'delete':
                if (data.length === 0) {
                    layer.msg('请选择一行');
                } else {
                    layer.confirm('确认要删除选中的这行吗？', function (index) {
                        var ids = []
                        for (var i = 0; i < checkStatus.data.length; i++) {
                            ids.push(checkStatus.data[i].id)
                        }
                        $.ajax({
                            url: 'http://localhost:8848/user/',
                            type: 'DELETE',
                            dataType: 'JSON',
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(ids),
                            success: function (obj) {
                                layer.msg(obj.msg);
                                table.reload('tabUser')
                            }
                        })
                        layer.close(index);
                    });
                }
                break;
        }

    });
    //监听行事件
    table.on('tool(tabUser)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        switch (obj.event) {
            case 'delete':
                layer.confirm('确认要删除吗？', function (index) {
                    var ids = []
                   
                    ids.push(data.id)
                    console.log(ids[0])
                    $.ajax({
                        url: 'http://localhost:8848/user/',
                        type: 'DELETE',
                        dataType: 'JSON',
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(ids),
                        success: function (obj) {
                            layer.msg(obj.msg);
                            table.reload('tabUser')
                        }
                    })
                    layer.close(index);
                });
                break;
            case 'update':
                row = data
                layer.open({
                    type: 2 //此处以iframe举例
                        ,
                    title: '修改客户',
                    area: ['450px', '500px'] //宽高
                        ,
                    shade: 0.5 //阴影（0-1之间的数）
                        ,
                    maxmin: true //最大、最小化按钮
                        ,
                    offset: [ //设置窗口位置
                        ($(window).height() - 500) / 2, ($(window).width() - 450) / 2
                    ],
                    content: '/html/userManager/editUser.html'
                })
                break;
        };
    });

    //在线编辑
            //监听单元格编辑
            table.on('edit(tabUser)', function (obj) {

                var value = obj.value //得到修改后的值
                    , data = obj.data //得到所在行所有键值
                    , field = obj.field; //得到字段
                console.log("1")
                $.ajax({
                    type: "PATCH",
                    url: "http://localhost:8848/user/",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify({
                        "val": value,
                        "field": field,
                        "id": data.id
                    }),
                    success: function (res) {
                        layer.msg(res.msg)
                    }

                })

            });
});