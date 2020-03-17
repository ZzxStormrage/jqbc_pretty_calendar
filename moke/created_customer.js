
function getCustomerlist(date) {

    // 请求数据 日期参数
    $.ajax({
        //请求方式为get
        type: "GET",
        //json文件位置
        url: "./moke/data.json",
        //返回数据格式为json
        dataType: "json",
        crossDomain: true,
        async: false,
        //请求成功完成后要执行的方法
        success: function (data) {
            console.log('请求数据成功');

            var list = data.list
            var trDom = $('.jqbc-table .date-tr')
            var tdDoM = $('.jqbc-table .date-td')
            var UlDom = '<ul class="customer-list"></ul>'
            $(tdDoM).append(UlDom)

            list.forEach(item => {
                var obj = {
                    customer_name: "张三", // 客户姓名
                    day: 2, // 星期几 从 1 开始
                    status: 1, // 状态 0未到店， 1已到店 2待确认，3已取消
                    what_time: 3, // 0 上午，1下午，2晚上
                    date: '12.15' // 到店时间
                }

                var tr = $(trDom).eq(item.what_time)
                var td = tr.find('td')[item.day]
                var ul = $(td).find('ul')


                var liDom = '<li class="status_' + item.status + '"><span>' + item.customer_name +
                    '</span><span>' + item.date + '</span></li>'
                ul.append(liDom)

            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}

