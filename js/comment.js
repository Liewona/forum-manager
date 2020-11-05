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
        elem: '#tabComment',
        height: 460,
        url: 'http://localhost:8848/comment/',
        xhrFields:{
            withCredentials:true
        },
        crossDomain: true,
        title: '评论管理',
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
                    field: 'did',
                    title: '帖子ID',
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
                    field: 'uname',
                    title: '用户',
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

        //执行重载
        table.reload('tabComment', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                "content": $("#content").val(),
            },
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            url: "http://localhost:8848/comment/like"
        });
    })

    table.on('toolbar(tabComment)', function (obj) {
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
                            url: 'http://localhost:8848/comment/',
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
                                table.reload('tabComment')
                            }
                        })
                        layer.close(index);
                    });
                }
                break;
        }

    });
    //监听行事件
    table.on('tool(tabComment)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        switch (obj.event) {
            case 'delete':
                layer.confirm('确认要删除吗？', function (index) {
                    var ids = []
                    ids.push(data.id)
                    console.log(ids[0])
                    $.ajax({
                        url: 'http://localhost:8848/comment/',
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
                            table.reload('tabComment')
                        }
                    })
                    layer.close(index);
                });
                break;
            case 'look':
                row = data
                layer.open({
                    type:2,
                    title:'该贴回复信息',
                    area: ['1050px', '700px'], //宽高
                    maxmin: true, //最大、最小化按钮
                    shade: 0.5, //阴影（0-1之间的数）
                    offset: [ //设置窗口位置
                        ($(window).height() - 700) / 2, ($(window).width() - 1050) / 2
                    ],
                    content:'/html/comment/CommentReply.html'
                })
                break;
        };
    });

    //在线编辑
    //监听单元格编辑
    table.on('edit(tabComment)', function (obj) {

        var value = obj.value //得到修改后的值
            ,
            data = obj.data //得到所在行所有键值
            ,
            field = obj.field; //得到字段
        $.ajax({
            type: "PATCH",
            url: "http://localhost:8848/comment/",
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
        table.reload('tabComment', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                "time": $("#time").val()
            },
            xhrFields:{
                withCredentials:true
            },
            crossDomain: true,
            url: "http://localhost:8848/comment/time"
        });
    })
});