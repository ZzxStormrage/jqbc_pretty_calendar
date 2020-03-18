;(function($) {
  $.fn.cdayTable = function() {
    $dayTable = this
    ceatedDayTable(this)

    // 获取日历时间
    var date = $('.date-title')
      .attr('jqbc-date')
      .split(',')
    var currentDate = new Date()
    var day = currentDate.getDay()

    if (day == 0) {
      day = 6
    }

    console.log('当前是星期', day)
    console.log('点击了', date[3])

    var active_day = date[3]
    if (active_day == 0) {
      active_day = 6
    }
    function formatDate(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    }

    if (date[0] == currentDate.getFullYear() && date[1] == currentDate.getMonth() + 1) {
      var startDay = new Date(date[0], date[1] - 1, date[2])
      if (SameWeek(formatDate(startDay))) {
        $('.jqbc-table-day')
          .eq(day)
          .addClass('start_day')
      }
    }
    $('.jqbc-table-day')
      .eq(date[3] - 1)
      .addClass('active')
  }

  function SameWeek(date) {
    var date1 = new Date(date.replace(/-/g, '/')) //将传入的时间字符串转换成时间对象
    var date2 = new Date() //当前时间
    var curWeek = date2.getDay() //获取当前星期几
    var monday = GetDate(curWeek, 1) //计算出星期一
    var sunday = GetDate(7 - curWeek, 2) //计算出星期天
    if (date1.getTime() < monday.getTime() || date1.getTime() > sunday.getTime()) {
      return false //不在同一个星期内
    } else {
      return true //在同一个星期内
    }
  }
  function GetDate(day, type) {
    var zdate = new Date()
    var edate
    
    if (type == 1) {
      edate = new Date(zdate.getTime() - day * 24 * 60 * 60 * 1000)
    } else {
      edate = new Date(zdate.getTime() + day * 24 * 60 * 60 * 1000)
    }
    
    return edate
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

    let parse = eval(compile(tableDom))
    $this.append(parse())
  }

  function compile(template) {
    const evalExpr = /<%=(.+?)%>/g
    const expr = /<%([\s\S]+?)%>/g

    template = template.replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`').replace(expr, '`); \n $1 \n  echo(`')

    template = 'echo(`' + template + '`);'

    let script = `(function parse(data){
                let output = "";

                function echo(html){
                output += html;
                }

                ${template}

                return output;
            })`

    return script
  }

  var week_name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var date_td = ['上午', '下午', '晚上']
})(jQuery)
