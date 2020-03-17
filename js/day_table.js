; (function ($) {
    $.fn.cdayTable = function () {
        $dayTable = this
        ceatedDayTable(this)

        // 获取日历时间
        var date = $('.date-title').attr('jqbc-date').split(',')
        var currentDate = new Date('2020,3,15');
        var day = currentDate.getDay()

        if (day == 0) {
            day = 6
        }

        var active_day = date[3]
        if (active_day == 0) {
            active_day = 6
        }

        console.log(date[2]);
        console.log(currentDate.getDate());



        if (date[0] == currentDate.getFullYear() && date[1] == currentDate.getMonth() + 1
            && date[2] == currentDate.getDate()) {
            $('.jqbc-table-day').eq(day).addClass('start_day')
        }
        $('.jqbc-table-day').eq(date[3] - 1).addClass('active')



    }

    function ceatedDayTable($this) {
        $this.empty()

        var tableDom = `<table class="table table-bordered jqbc-table">
            <thead>
                <tr class="jqbc-table-hader">
                    <th class=""></th>
                    <% for(let i=0; i < 7; i++) { %>
                        <td class="jqbc-table-day ">
                            <span class='day-en'><%= i + 1 %></span>
                            <span class='day-en'><%= week_name[i] %></span>
                        </td>
                    <% } %>
                </tr>
            </thead>
            <tbody> 
                <% for(let i=0; i < date_td.length; i++) { %>
                    <tr class='date-tr'>
                        <th class='align-middle text-center '>
                            <small class='date-name'>
                                <%= date_td[i] %>
                            </small>
                        </th>
                        <% for(let i=0; i < 7; i++) { %>
                            <td class='date-td morning'></td>
                        <% } %>
                    </tr>
                <% } %>

            </tbody>
            </table>`

        let parse = eval(compile(tableDom));
        $this.append(parse());

    }


    function compile(template) {
        const evalExpr = /<%=(.+?)%>/g;
        const expr = /<%([\s\S]+?)%>/g;

        template = template
            .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
            .replace(expr, '`); \n $1 \n  echo(`');

        template = 'echo(`' + template + '`);';

        let script =
            `(function parse(data){
                let output = "";

                function echo(html){
                output += html;
                }

                ${ template}

                return output;
            })`;

        return script;
    }


    var week_name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    var date_td = ['上午', '下午', '晚上']
})(jQuery)