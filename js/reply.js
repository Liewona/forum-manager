var table;
layui.use(['table', 'jquery', 'layer', 'laydate'], function () {
    table = layui.table;
    var $ = layui.jquery
    var layer = layui.layer
    var laydate = layui.laydate
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });
    table.render({
        elem: '#tabReply',
        height: 460,
        url: 'http://localhost:8848/reply/?id='+parent.row.id,
        xhrFields:{
            withCredentials:true
        },
        crossDomain: true,
        title: '评论回复管理',
        page: true //开启分页--会在地址后面自动添加?page=1&limit=10
            ,
        toolbar: '#headBar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,
        cols: [
            [ //表头
                {
                    type: 'checkbox',
                    fixed: 'left',
                }, {
                    field: 'id',
                    title: 'ID',
                    width: 100
                }, {
                    field: 'fromId',
                    title: '回复人',
                    width: 100
                },{
                    field: 'toId',
                    title: '被回复人',
                    width: 100
                }, {
                    field: 'content',
                    title: '评论内容',
                    edit: 'text'
                }, {
                    field: 'createTime',
                    title: '评论时间',
                    width: 200,
                    sort: true
                }, {
                    field: 'remarkId',
                    title: '帖子ID',
                    width: 100
                }, {
                    fixed: 'right',
                    width: 150,
                    align: 'center',
                    toolbar: '#toolUser'
                }
            ]
        ]
    });

    $("#search").on('click', function () {
        console.log(parent.row.id)
        //执行重载
        table.reload('tabReply', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                "content": $("#content").val(),
                "id":parent.row.id
            },
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            url: "http://localhost:8848/reply/like"
        });
    })

    table.on('toolbar(tabReply)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id),
            data = checkStatus.data; //获取选中的数据
        switch (obj.event) {
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
                            url: 'http://localhost:8848/reply/',
                            type: 'DELETE',
                            dataType: 'JSON',
                            xhrFields:{
                                withCredentials:true
                            },
                            crossDomain: true,
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(ids),
                            success: function (obj) {
                                layer.msg(obj.msg);
                                table.reload('tabReply')
                            }
                        })
                        layer.close(index);
                    });
                }
                break;
        }

    });
    //监听行事件
    table.on('tool(tabReply)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        switch (obj.event) {
            case 'delete':
                layer.confirm('确认要删除吗？', function (index) {
                    var ids = []
                    ids.push(data.id)
                    console.log(ids[0])
                    $.ajax({
                        url: 'http://localhost:8848/reply/',
                        type: 'DELETE',
                        dataType: 'JSON',
                        xhrFields:{
                            withCredentials:true
                        },
                        crossDomain: true,
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(ids),
                        success: function (obj) {
                            layer.msg(obj.msg);
                            table.reload('tabReply')
                        }
                    })
                    layer.close(index);
                });
                break;
        };
    });

    //在线编辑
    //监听单元格编辑
    table.on('edit(tabReply)', function (obj) {

        var value = obj.value //得到修改后的值
            ,
            data = obj.data //得到所在行所有键值
            ,
            field = obj.field; //得到字段
        $.ajax({
            type: "PATCH",
            url: "http://localhost:8848/reply/",
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
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

    laydate.render({
        elem: '#time' //指定元素
            ,
        range: "~",
        trigger: 'click' //处理时间弹框闪退
            ,
        type: 'datetime'
    });

    $("#timesearch").on('click', function () {
        console.log($("#time").val())
        //执行重载
        table.reload('tabReply', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                "time": $("#time").val(),
                "id":parent.row.id
            },
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            url: "http://localhost:8848/reply/time"
        });
    })
});