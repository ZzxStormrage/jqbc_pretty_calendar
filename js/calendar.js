/**
 * 2020 3-13
 * zzx 
 */
; (function ($) {

    // 定义初始化方法
    var methods = {
        init: function (options) { },
        destroy: function () {
            this.empty()
        },
        bind: function (event) {
            alert('event')
        },
        hide: function () {
            this.hide()
        },
    }

    // 初始化插件
    $.fn.calendar = function (options) {
        $calendar = this

        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1))
        } else if (typeof options === 'object' || !options) {
            settings = $.extend({}, $.fn.calendar.defaults, options)

            // 创建DOM
            createWholeCalendar(settings, this);
            addClickEvent()

            // 上一年 点击事件
            function showPreviousYear() {
                var currentYear = parseInt($(this).text());
                settings.startYear = settings.startYear - 1;
                $calendar.trigger("jqyc.changeYearToPrevious", settings);
                $calendar.trigger("jqyc.changeDateToPrevious", settings);
                createWholeCalendar(settings, $calendar);
                addClickEvent()
                $(this).data('currentYear', currentYear);
            }
            // 下一年点击事件
            function showNextYear() {
                var currentYear = parseInt($(this).text());
                settings.startYear = settings.startYear + 1;
                createWholeCalendar(settings, $calendar);
                $calendar.trigger('jqyc.changeYearToNext', settings);
                $calendar.trigger("jqyc.changeDateToPrevious", settings);
                addClickEvent()
                $(this).data('currentYear', currentYear);

            }
            // 选择月份点击事件
            function selectMoth() {

                var month = $(this).index()
                console.log('选中月份', month);
                settings.satrtMonth = month
                
                if (month != currentDate.getMonth() + 1) {
                  settings.satrtDate = 1
                  var date = new Date(settings.startYear,settings.satrtMonth,1)
                  
                  var day = date.getDay()
                  console.log(day);

                  if (day == 0) {
                    day = 6
                  }
                  settings.satrtDay = day
                }else {
                  settings.satrtDate = currentDate.getDate()
                  settings.satrtDay =  currentDate.getDay()
                }
                createWholeCalendar(settings, $calendar);
                if (month != currentDate.getMonth() + 1) {
                  $('.jqyc-li').eq(0).addClass('active')
                }
                $('.jqyc-month').eq(month - 1).addClass('active')
                addClickEvent()
                $calendar.trigger("jqyc.changeDateToPrevious", settings);
            }
            // 选择星期几点击事件
            function selectDay() {
                var day = $(this).index() + 1
                if (day == 7) {
                    day = 0
                }
                console.log('选择星期', day);
                var date = $(this).attr('data-day-of-month')
                settings.satrtDay = day
                settings.satrtDate = date
                createWholeCalendar(settings, $calendar);
                $('.jqyc-li').eq(date - 1).addClass('active')
                addClickEvent()
                $calendar.trigger("jqyc.changeDateToPrevious", settings);
            }
            // 回到今天点击事件
            function goToday() {
                console.log('回到今天');
                // var currentDate = new Date();
                settings.startYear = currentDate.getFullYear()
                settings.satrtMonth = currentDate.getMonth() + 1
                settings.satrtDate = currentDate.getDate()
                settings.satrtDay = currentDate.getDay()

                console.log(currentDate.getMonth() + 1);
                console.log(settings);

                createWholeCalendar(settings, $calendar);
                addClickEvent()
                $calendar.trigger("jqyc.goToday", settings);

            }

            function addClickEvent() {
                $calendar.find('.jqyc-prev-year').on("click", showPreviousYear);
                $calendar.find('.jqyc-next-year').on("click", showNextYear);
                $calendar.find('.jqyc-month').on("click", selectMoth);
                $calendar.find('.jqyc-li').on("click", selectDay);
                $calendar.find('.today').on("click", goToday);
            }

            return methods.init.apply(this, arguments)
        } else {
            $.error('Method ' + options + ' does not exist on jQuery.tooltip')
        }
    }

    // 获取当前日期
    var currentDate = new Date();

    $.fn.calendar.defaults = {
        startYear: currentDate.getFullYear(),
        satrtMonth: currentDate.getMonth() + 1,
        satrtDate: currentDate.getDate(),
        satrtDay: currentDate.getDay(),
        month: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "Augst",
            "September",
            "October",
            "November",
            "December",
        ],
        day_arr: ['日', '一', '二', '三', '四', '五', '六',],
        week: ['Su', 'Mn', "Tu", 'We', 'TH', 'Fr', 'Sa']
    };

    function createWholeCalendar(settings, $this) {
        $this.empty();

        var year = settings.startYear;

        // 本年的 第一天是星期几
        var firstDayOfCurrentYear = new Date(year, 0).getDay();

        let date = new Date();

        // 平年闰年
        var leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
        if (leapYear) {
            var daysOfFeb = 29;
        } else {
            daysOfFeb = 28;
        }


        var domSkeleton = `<div class="jqyc"><div class="jqyc-year-chooser ">
            <div class="year-header row">
            <button class="year-btn jqyc-prev-year jqyc-change-year col">${(year - 1)}</button>
            <button class="year-btn jqyc-next-year jqyc-change-year col">${(year + 1)}</button>
            </div>
            <div class="date-title-wrap"></div>
            <div class="week_wrap">
                <div class="week_list"></div>
            </div>
        </div></div>`

        // 在html 上挂在DOM
        var $html = $($this);
        $html.append(domSkeleton);

        // 循环生成 month
        $(settings.month).each((index, m) => {
            var monthDom = $('<button class="year-btn jqyc-month col">' + m.slice(0, 3) + '</button>')
            $('.jqyc-prev-year').after(monthDom)
        });
        if (year == currentDate.getFullYear()) {
            $('.jqyc-month').eq(currentDate.getMonth()).addClass('start_month')

        }

        // 显示中文年月日星期
        var current_date = settings.startYear + '年' + settings.satrtMonth + '月' + settings.satrtDate +
            '号 星期' + settings.day_arr[settings.satrtDay] + ''
        var dateTitle = '<h4 class="date-title"' +
            'jqbc-date=' + [settings.startYear, settings.satrtMonth, settings.satrtDate, settings.satrtDay] + '>' + current_date + '</h4>'
        $('.date-title-wrap').append(dateTitle)

        // 回到今天按钮
        var backToDay = '<a class="today">today</a>'
        $('.date-title-wrap').append(backToDay)

        // 每个月的日历 计算多少天
        var results = jqycGetMonthHTMLStringWithData(year, settings.satrtMonth);
        $('.week_list').append(results.monthHTMLString)

        if (settings.satrtMonth == currentDate.getMonth() + 1 && settings.startYear == currentDate.getFullYear()) {
            $('.jqyc-li').eq(currentDate.getDate() - 1).addClass('start_date')
        }

    }

    function jqycGetMonthHTMLStringWithData(year, month) {

        // 计算当前年月 1号是星期几
        var firstDay = getYearDay(year, month - 1)
        var days = getYearMonthDays(year, month)

        // 用于计算的 星期几
        var c_day = parseInt(firstDay)

        if (c_day == 0) {
            c_day = 7
        }

        var d = 1;
        var i = 1;

        var monthHTMLString = '';

        while (d <= days) {

            if (i % 7 == 1) {
                monthHTMLString = monthHTMLString + '<ul class="jqyc-week-ul">'
            }
            if (i < c_day) {
                d--;
                monthHTMLString = monthHTMLString + '<li class="jqyc-empty-td jqyc-td"></li>';
            } else {

                monthHTMLString = monthHTMLString +
                    '<li class="jqyc-li jqyc-day-' + d
                    + ' jqyc-day-of-' + month + '-month" data-month="' + month
                    + '" data-day-of-month="' + d + '" data-year="' + year + '">'
                    + '<span class="week-date">' + settings.week[firstDay] + '</span>'
                    + '<span class="week-day">' + d + '</span></li>';

                firstDay++
                if (firstDay >= 7) {
                    firstDay = 0
                }
            }

            if (i % 7 == 0) {
                monthHTMLString = monthHTMLString + '</ul>'
            }

            i++;
            d++;

        }

        return { monthHTMLString: monthHTMLString, firstDayOfPreviousMonth: (i % 7) };
    }

    // 计算当前月是星期几
    function getYearDay(year, month) {
        var oDate = new Date(year, month);
        oDate.setDate(1);
        var firstDay = oDate.getDay()
        return firstDay
    }
    // 计算当前月一共多少天
    function getYearMonthDays(year, month) {
        var day = new Date(year, month, 0);
        return day.getDate()
    }

})(jQuery)
