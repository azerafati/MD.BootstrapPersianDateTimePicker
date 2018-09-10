﻿﻿/*
 * Bootstrap 4+ Persian Date Time Picker jQuery Plugin
 * version : 3.0.0
 * https://github.com/Mds92/MD.BootstrapPersianDateTimePicker
 *
 *
 * Written By Mohammad Dayyan, Mordad 1397
 * mds.soft@gmail.com - @mdssoft
 *
 * My weblog: mds-soft.persianblog.ir
 */

(function ($) {

    // #region jalali calendar

    function toJalaali(gy, gm, gd) {
        return d2j(g2d(gy, gm, gd));
    }

    function toGregorian(jy, jm, jd) {
        return d2g(j2d(jy, jm, jd));
    }

    function isValidJalaaliDate(jy, jm, jd) {
        return jy >= -61 && jy <= 3177 &&
            jm >= 1 && jm <= 12 &&
            jd >= 1 && jd <= jalaaliMonthLength(jy, jm);
    }

    function isLeapJalaaliYear(jy) {
        return jalCal(jy).leap === 0;
    }

    function jalaaliMonthLength(jy, jm) {
        if (jm <= 6) return 31;
        if (jm <= 11) return 30;
        if (isLeapJalaaliYear(jy)) return 30;
        return 29;
    }

    function jalCal(jy) {
        // Jalaali years starting the 33-year rule.
        var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178],
            bl = breaks.length,
            gy = jy + 621,
            leapJ = -14,
            jp = breaks[0],
            jm,
            jump = 1,
            leap,
            n,
            i;

        if (jy < jp || jy >= breaks[bl - 1])
            throw new Error('Invalid Jalaali year ' + jy);

        // Find the limiting years for the Jalaali year jy.
        for (i = 1; i < bl; i += 1) {
            jm = breaks[i];
            jump = jm - jp;
            if (jy < jm)
                break;
            leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
            jp = jm;
        }
        n = jy - jp;

        // Find the number of leap years from AD 621 to the beginning
        // of the current Jalaali year in the Persian calendar.
        leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
        if (mod(jump, 33) === 4 && jump - n === 4)
            leapJ += 1;

        // And the same in the Gregorian calendar (until the year gy).
        var leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

        // Determine the Gregorian date of Farvardin the 1st.
        var march = 20 + leapJ - leapG;

        // Find how many years have passed since the last leap year.
        if (jump - n < 6)
            n = n - jump + div(jump + 4, 33) * 33;
        leap = mod(mod(n + 1, 33) - 1, 4);
        if (leap === -1) leap = 4;

        return {
            leap: leap,
            gy: gy,
            march: march
        };
    }

    function j2d(jy, jm, jd) {
        var r = jalCal(jy);
        return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
    }

    function d2j(jdn) {
        var gy = d2g(jdn).gy, // Calculate Gregorian year (gy).
            jy = gy - 621,
            r = jalCal(jy),
            jdn1F = g2d(gy, 3, r.march),
            jd,
            jm,
            k;

        // Find number of days that passed since 1 Farvardin.
        k = jdn - jdn1F;
        if (k >= 0) {
            if (k <= 185) {
                // The first 6 months.
                jm = 1 + div(k, 31);
                jd = mod(k, 31) + 1;
                return {
                    jy: jy,
                    jm: jm,
                    jd: jd
                };
            } else {
                // The remaining months.
                k -= 186;
            }
        } else {
            // Previous Jalaali year.
            jy -= 1;
            k += 179;
            if (r.leap === 1)
                k += 1;
        }
        jm = 7 + div(k, 30);
        jd = mod(k, 30) + 1;
        return {
            jy: jy,
            jm: jm,
            jd: jd
        };
    }

    function g2d(gy, gm, gd) {
        var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
            div(153 * mod(gm + 9, 12) + 2, 5) +
            gd - 34840408;
        d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
        return d;
    }

    function d2g(jdn) {
        var j;
        j = 4 * jdn + 139361631;
        j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
        var i = div(mod(j, 1461), 4) * 5 + 308;
        var gd = div(mod(i, 153), 5) + 1;
        var gm = mod(div(i, 153), 12) + 1;
        var gy = div(j, 1461) - 100100 + div(8 - gm, 6);
        return {
            gy: gy,
            gm: gm,
            gd: gd
        };
    }

    function div(a, b) {
        return ~~(a / b);
    }

    function mod(a, b) {
        return a - ~~(a / b) * b;
    }

    //#endregion jalali calendar

    // #region variables

    var mdDatePickerFlag = 'data-mdpersiandatetimepicker',
        mdDatePickerFlagSelector = '[' + mdDatePickerFlag + ']',
        mdDatePickerGroupIdAttribute = 'data-mdpersiandatetimepicker-group',
        mdDatePickerPopoverFlag = 'data-mdpersiandatetimepicker-popover',
        mdDatePickerPopoverSelector = '[' + mdDatePickerPopoverFlag + ']',
        mdDatePickerContainerFlag = 'data-mdpersiandatetimepicker-container',
        mdDatePickerContainerSelector = '[' + mdDatePickerContainerFlag + ']',
        mdPluginName = 'MdPersianDateTimePicker',
        triggerStart = false;

    var popverHtmlTemplate = `
<div class="popover mds-bootstrap-persian-datetime-picker-popover" role="tooltip" ${mdDatePickerPopoverFlag}>
    <div class="arrow"></div>
    <h3 class="popover-header text-center" data-name="mds-datetimepicker-title"></h3>
    <div class="popover-body p-0" data-name="mds-datetimepicker-popoverbody"></div>
</div>`;

    var dateTimePickerHtmlTemplate = `
<div class="mds-bootstrap-persian-datetime-picker-container {{rtlCssClass}}" ${mdDatePickerContainerFlag}>
    <div class="select-year-box w-0">
        <div class="container-fluid">
            <div class="row">
                {{yearsToSelectHtml}}
            </div>
        </div>
    </div>
    <table class="table table-sm text-center p-0 m-0">
        <thead>
            <tr {{selectedDateStringAttribute}}>
                <th colspan="100" data-selecteddatestring>{{selectedDateString}}</th>
            </tr>            
        </thead>
        <tbody>
            <tr>
                {{monthsTdHtml}}
            </tr>
        </tbody>
        <tfoot>
            <tr {{timePickerAttribute}}>
                <td colspan="100">
                    <table class="table table-sm table-borderless">
                        <tbody>
                            <tr>
                                <td>
                                    <input type="text" title="{{hourText}}" value="{{hour}}" maxlength="2" data-clock="hour" />
                                </td>
                                <td>:</td>
                                <td>
                                    <input type="text" title="{{minuteText}}" value="{{minute}}" maxlength="2" data-clock="minute" />
                                </td>
                                <td>:</td>
                                <td>
                                    <input type="text" title="{{secondText}}" value="{{second}}" maxlength="2" data-clock="second" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="100">
                    <button type="button" class="btn btn-light" title="{{goTodayText}}" data-go-today>{{todayDateString}}</button>
                </td>
            </tr>
        </tfoot>
    </table>
</div>`;

    var dateTimePickerMonthTableHtmlTemplate = `
<td style="{{monthTdStyle}}" {{monthTdAttribute}} data-td-month>
	<table class="table table-sm table-striped table-borderless">
		<thead>
			<tr {{monthNameAttribute}}>
				<th colspan="100">
					<table class="table table-sm table-borderless">
						<thead>
							<tr>
								<th>
									<button type="button" class="btn btn-light"> {{currentMonthInfo}} </button>
								</th>
							</tr>
						</thead>
					</table>
				</th>
			</tr>
			<tr {{theadSelectDateButtonTrAttribute}}>
                <td colspan="100">
                    <table class="table table-sm table-borderless">
                        <tr>
                            <th>
                                <button type="button" class="btn btn-light btn-sm" title="{{previousYearText}}" data-changedatebutton data-number="{{previousYearButtonDateNumber}}" {{previousYearButtonDisabledAttribute}}> &lt;&lt; </button>
                            </th>
                            <th>
                                <button type="button" class="btn btn-light btn-sm" title="{{previousMonthText}}" data-changedatebutton data-number="{{previousMonthButtonDateNumber}}" {{previousMonthButtonDisabledAttribute}}> &lt; </button>
                            </th>
                            <th style="width: 120px;">
                                <div class="dropdown">
                                    <button type="button" class="btn btn-light btn-sm dropdown-toggle" id="mdsBootstrapPersianDatetimePickerMonthSelectorButon"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {{selectedMonthName}}
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="mdsBootstrapPersianDatetimePickerMonthSelectorButon">
                                        <a class="dropdown-item {{selectMonth1ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth1DateNumber}}">{{monthName1}}</a>
                                        <a class="dropdown-item {{selectMonth2ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth2DateNumber}}">{{monthName2}}</a>
                                        <a class="dropdown-item {{selectMonth3ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth3DateNumber}}">{{monthName3}}</a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item {{selectMonth4ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth5DateNumber}}">{{monthName4}}</a>
                                        <a class="dropdown-item {{selectMonth5ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth6DateNumber}}">{{monthName5}}</a>
                                        <a class="dropdown-item {{selectMonth6ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth6DateNumber}}">{{monthName6}}</a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item {{selectMonth7ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth7DateNumber}}">{{monthName7}}</a>
                                        <a class="dropdown-item {{selectMonth8ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth8DateNumber}}">{{monthName8}}</a>
                                        <a class="dropdown-item {{selectMonth9ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth9DateNumber}}">{{monthName9}}</a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item {{selectMonth10ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth10DateNumber}}">{{monthName10}}</a>
                                        <a class="dropdown-item {{selectMonth11ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth11DateNumber}}">{{monthName11}}</a>
                                        <a class="dropdown-item {{selectMonth12ButtonCssClass}}" data-changedatebutton data-number="{{dropDownMenuMonth12DateNumber}}">{{monthName12}}</a>
                                    </div>
                                </div>
                            </th>
                            <th style="width: 50px;">
                                <button type="button" class="btn btn-light btn-sm" select-year-button {{selectYearButtonDisabledAttribute}}>{{selectedYear}}</button>
                            </th>
                            <th>
                                <button type="button" class="btn btn-light btn-sm" title="{{nextMonthText}}" data-changedatebutton data-number="{{nextMonthButtonDateNumber}}" {{nextMonthButtonDisabledAttribute}}> &gt; </button>
                            </th>
                            <th>
                                <button type="button" class="btn btn-light btn-sm" title="{{nextYearText}}" data-changedatebutton data-number="{{nextYearButtonDateNumber}}" {{nextYearButtonDisabledAttribute}}> &gt;&gt; </button>
                            </th>
                        </tr>
                    </table>
                </td>
			</tr>
		</thead>
		<tbody class="days">
            <tr>
                <td class="{{weekDayShortName1CssClass}}">{{weekDayShortName1}}</td>
                <td>{{weekDayShortName2}}</td>
                <td>{{weekDayShortName3}}</td>
                <td>{{weekDayShortName4}}</td>
                <td>{{weekDayShortName5}}</td>
                <td>{{weekDayShortName6}}</td>
                <td class="{{weekDayShortName7CssClass}}">{{weekDayShortName7}}</td>
            </tr>
        {{daysHtml}}
		</tbody>
	</table>
</td>
    `;

    var previousYearTextPersian = 'سال قبل',
        previousMonthTextPersian = 'ماه قبل',
        nextYearTextPersian = 'سال بعد',
        nextMonthTextPersian = 'ماه بعد',
        hourTextPersian = 'ساعت',
        minuteTextPersian = 'دقیقه',
        secondTextPersian = 'ثانیه',
        goTodayTextPersian = 'برو به امروز',
        previousYearText = 'Previous Year',
        previousMonthText = 'Previous Month',
        nextYearText = 'Next Year',
        nextMonthText = 'Next Month',
        goTodayText = 'Go Today',
        hourText = 'Hour',
        minuteText = 'Minute',
        secondText = 'Second',
        amPm = {
            am: 0,
            pm: 1,
            none: 2
        },
        shortDayNamesPersian = [
            'ش',
            'ی',
            'د',
            'س',
            'چ',
            'پ',
            'ج',
        ],
        shortDayNames = [
            'SU',
            'MO',
            'TU',
            'WE',
            'TH',
            'FR',
            'SA',
        ],
        monthNamesPersian = [
            'فروردین',
            'اردیبهشت',
            'خرداد',
            'تیر',
            'مرداد',
            'شهریور',
            'مهر',
            'آبان',
            'آذر',
            'دی',
            'بهمن',
            'اسفند'
        ],
        monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        weekDayNames = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        weekDayNamesPersian = [
            'یک شنبه',
            'دوشنبه',
            'سه شنبه',
            'چهارشنبه',
            'پنج شنبه',
            'جمعه',
            'شنبه'
        ];

    //#endregion

    // #region Functions

    function getPopoverDescriber($element) {
        // المانی را بر میگرداند که کاربر پلاگین را روی آن فعال کرده است
        var $popoverDescriber = $element.parents(mdDatePickerFlagSelector + ':first'); // inline
        // not inline
        if ($popoverDescriber.length <= 0) {
            $popoverDescriber = $element.parents(mdDatePickerPopoverSelector + ':first');
            $popoverDescriber = $('[aria-describedby="' + $popoverDescriber.attr('id') + '"]');
        }
        return $popoverDescriber;
    }

    function getSetting1($element) {
        return getPopoverDescriber($element).data(mdPluginName);
    }

    function getSetting2($popoverDescriber) {
        return $popoverDescriber.data(mdPluginName);
    }

    function setSetting1($element, setting) {
        return getPopoverDescriber($element).data(mdPluginName, setting);
    }

    function setSetting2($popoverDescriber, setting) {
        return $popoverDescriber.data(mdPluginName, setting);
    }

    function updateCalendarHtml1($element, setting) {
        var calendarHtml = getDateTimePickerHtml(setting),
            $container = setting.inLine ? $element.parents(mdDatePickerFlagSelector + ':first') : $element.parents('[data-name="mds-datetimepicker-popoverbody"]:first');
        //selectedDateString = $(calendarHtml).find('[data-selecteddatestring]').text().trim();
        $container.html(calendarHtml);
    }

    function getSelectedDateTimeText(setting) {
        if (setting.selectedDate == undefined) return '';
        return getDateTimeString(!setting.isGregorian ? getDateTimeJsonPersian1(setting.selectedDate) : getDateTimeJson1(setting.selectedDate), setting.format, setting.isGregorian, setting.englishNumber);
    }

    function setSelectedText(setting) {
        var $target = $(setting.targetSelector);
        if ($target.length <= 0) return;
        switch ($target[0].tagName.toLowerCase()) {
            case 'input':
                $target.val(getSelectedDateTimeText(setting));
                break;
            default:
                $target.text(getSelectedDateTimeText(setting));
                break;
        }
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function toPersianNumber(inputNumber1) {
        /* ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ */
        if (!inputNumber1) return '';
        var str1 = inputNumber1.toString().trim();
        if (!str1) return '';
        str1 = str1.replace(/0/img, '۰');
        str1 = str1.replace(/1/img, '۱');
        str1 = str1.replace(/2/img, '۲');
        str1 = str1.replace(/3/img, '۳');
        str1 = str1.replace(/4/img, '۴');
        str1 = str1.replace(/5/img, '۵');
        str1 = str1.replace(/6/img, '۶');
        str1 = str1.replace(/7/img, '۷');
        str1 = str1.replace(/8/img, '۸');
        str1 = str1.replace(/9/img, '۹');
        return str1;
    }

    function toEnglishNumber(inputNumber2) {
        if (!inputNumber2) return '';
        var str = inputNumber2.toString().trim();
        if (!str) return '';
        str = str.replace(/۰/img, '0');
        str = str.replace(/۱/img, '1');
        str = str.replace(/۲/img, '2');
        str = str.replace(/۳/img, '3');
        str = str.replace(/۴/img, '4');
        str = str.replace(/۵/img, '5');
        str = str.replace(/۶/img, '6');
        str = str.replace(/۷/img, '7');
        str = str.replace(/۸/img, '8');
        str = str.replace(/۹/img, '9');
        return str;
    }

    function getMonthName(monthIndex, isGregorian) {
        if (!isGregorian) return monthNamesPersian[monthIndex];
        return monthNames[monthIndex];
    }

    function addMonthToDateTimeJson(dateTimeJson, addedMonth, isGregorian) {
        // وقتی نیاز هست تا ماه یا روز به تاریخی اضافه کنم
        // پس از اضافه کردن ماه یا روز این متد را استفاده میکنم تا سال و ماه
        // با مقادیر جدید تصحیح و برگشت داده شوند
        var dateTimeJson1 = $.extend({}, dateTimeJson);
        dateTimeJson1.day = 1;
        dateTimeJson1.month += addedMonth;
        if (!isGregorian) {
            if (dateTimeJson1.month <= 0) {
                dateTimeJson1.month = 12;
                dateTimeJson1.year--;
            }
            if (dateTimeJson1.month > 12) {
                dateTimeJson1.year++;
                dateTimeJson1.month = 1;
            }
            return dateTimeJson1;
        }
        return getDateTimeJson1(getDateTime3(dateTimeJson1));
    }

    function addMonthToDateTime(dateTime, addedMonth, isGregorian) {
        var dateTimeJson = {};
        if (!isGregorian) {
            dateTimeJson = getDateTimeJsonPersian1(dateTime);
            dateTimeJson = addMonthToDateTimeJson(dateTimeJson, addedMonth, isGregorian);
            return getDateTime2(dateTimeJson);
        }
        dateTimeJson = getDateTimeJson1(dateTime);
        dateTimeJson = addMonthToDateTimeJson(dateTimeJson, addedMonth, isGregorian);
        return getDateTime3(dateTimeJson);
    }

    function getWeekDayName(englishWeekDayIndex, isGregorian) {
        if (!isGregorian) return weekDayNamesPersian[englishWeekDayIndex];
        return weekDayNames[englishWeekDayIndex];
    }

    function getWeekDayShortName(englishWeekDayIndex, isGregorian) {
        if (!isGregorian) return shortDayNamesPersian[englishWeekDayIndex];
        return shortDayNames[englishWeekDayIndex];
    }

    function getShortHour(hour) {
        var shortHour;
        if (hour > 12)
            shortHour = hour - 12;
        else
            shortHour = hour;
        return shortHour;
    }

    function getAmPm(hour, isGregorian) {
        var amPm;
        if (hour > 12) {
            if (isGregorian)
                amPm = 'PM';
            else
                amPm = 'ب.ظ';
        } else
            if (isGregorian)
                amPm = 'AM';
            else
                amPm = 'ق.ظ';
        return amPm;        
    }

    function hideOthers($exceptThis) {
        $(mdDatePickerPopoverSelector).each(function () {
            var $thisPopover = $(this);
            if (!$exceptThis && $exceptThis.is($thisPopover)) return;
            hidePopover($thisPopover);
        });
    }

    function showPopover($element) {
        if (!$element) return;
        $element.popover('show');
    }

    function hidePopover($element) {
        if (!$element) return;
        $element.popover('hide');
    }

    function convertToNumber1(dateTimeJson) {
        return Number(zeroPad(dateTimeJson.year) + zeroPad(dateTimeJson.month) + zeroPad(dateTimeJson.day));
    }

    function convertToNumber2(year, month, day) {
        return Number(zeroPad(year) + zeroPad(month) + zeroPad(day));
    }

    function getDateTime1(yearPersian, monthPersian, dayPersian, hour, minute, second) {
        if (!isNumber(hour)) hour = 0;
        if (!isNumber(minute)) minute = 0;
        if (!isNumber(second)) second = 0;
        var gregorian = toGregorian(yearPersian, monthPersian, dayPersian);
        return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hour, minute, second);
    }

    function getDateTime2(dateTimeJsonPersian) {
        if (!dateTimeJsonPersian.hour) dateTimeJsonPersian.hour = 0;
        if (!dateTimeJsonPersian.minute) dateTimeJsonPersian.minute = 0;
        if (!dateTimeJsonPersian.second) dateTimeJsonPersian.second = 0;
        var gregorian = toGregorian(dateTimeJsonPersian.year, dateTimeJsonPersian.month, dateTimeJsonPersian.day);
        return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, dateTimeJsonPersian.hour, dateTimeJsonPersian.minute, dateTimeJsonPersian.second);
    }

    function getDateTime3(dateTimeJson) {
        return new Date(dateTimeJson.year, dateTimeJson.month - 1, dateTimeJson.day, dateTimeJson.hour, dateTimeJson.minute, dateTimeJson.second);
    }

    function getDateTime4(dateNumber, dateTime, setting) {
        var dateTimeJson = getDateTimeJson2(dateNumber);
        if (!setting.isGregorian) {
            var dateTimeJsonPersian = getDateTimeJsonPersian1(dateTime);
            dateTimeJsonPersian.year = dateTimeJson.year;
            dateTimeJsonPersian.month = dateTimeJson.month;
            dateTimeJsonPersian.day = dateTimeJson.day;
            dateTime = getDateTime2(dateTimeJsonPersian);
        }
        else
            dateTime = new Date(dateTimeJson.year, dateTimeJson.month - 1, dateTimeJson.day);
        return dateTime;
    }

    function getDateTimeJson1(dateTime) {
        return {
            year: dateTime.getFullYear(),
            month: dateTime.getMonth() + 1,
            day: dateTime.getDate(),
            hour: dateTime.getHours(),
            minute: dateTime.getMinutes(),
            second: dateTime.getSeconds(),
            dayOfWeek: dateTime.getDay()
        };
    }

    function getDateTimeJson2(dateNumber) {
        return {
            year: Math.floor(dateNumber / 10000),
            month: Math.floor(dateNumber / 100) % 100,
            day: dateNumber % 100,
            hour: 0,
            minute: 0,
            second: 0
        };
    }

    function getDateTimeJsonPersian1(dateTime) {
        var persianDate = toJalaali(dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate());
        return {
            year: persianDate.jy,
            month: persianDate.jm,
            day: persianDate.jd,
            hour: dateTime.getHours(),
            minute: dateTime.getMinutes(),
            second: dateTime.getSeconds(),
            dayOfWeek: dateTime.getDay(),
        };
    }

    function getDateTimeJsonPersian2(yearPersian, monthPersian, dayPersian, hour, minute, second) {
        if (!isNumber(hour)) hour = 0;
        if (!isNumber(minute)) minute = 0;
        if (!isNumber(second)) second = 0;
        var gregorian = toGregorian(yearPersian, monthPersian, dayPersian);
        return getDateTimeJsonPersian1(new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hour, minute, second));
    }

    function isLeapYear(persianYear) {
        return isLeapJalaaliYear(persianYear);
    }

    function getDaysInMonthPersian(year, month) {
        var numberOfDaysInMonth = 31;
        if (month > 6 && month < 12)
            numberOfDaysInMonth = 30;
        else if (month == 12)
            numberOfDaysInMonth = isLeapYear(year) ? 30 : 29;
        return numberOfDaysInMonth;
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getClonedDate(dateTime) {
        return new Date(dateTime.getTime());
    }

    function zeroPad(nr, base) {
        if (nr == undefined || nr == '') return '00';
        if (base == undefined || base == '') base = '00';
        var len = (String(base).length - String(nr).length) + 1;
        return len > 0 ? new Array(len).join('0') + nr : nr;
    }

    function getDateTimeString(dateTimeJson, format, isGregorian, englishNumber) {

        if (isGregorian) englishNumber = true;

        /// فرمت های که پشتیبانی می شوند
        /// <para />
        /// yyyy: سال چهار رقمی
        /// <para />
        /// yy: سال دو رقمی
        /// <para />
        /// MMMM: نام فارسی ماه
        /// <para />
        /// MM: عدد دو رقمی ماه
        /// <para />
        /// M: عدد یک رقمی ماه
        /// <para />
        /// dddd: نام فارسی روز هفته
        /// <para />
        /// dd: عدد دو رقمی روز ماه
        /// <para />
        /// d: عدد یک رقمی روز ماه
        /// <para />
        /// HH: ساعت دو رقمی با فرمت 00 تا 24
        /// <para />
        /// H: ساعت یک رقمی با فرمت 0 تا 24
        /// <para />
        /// hh: ساعت دو رقمی با فرمت 00 تا 12
        /// <para />
        /// h: ساعت یک رقمی با فرمت 0 تا 12
        /// <para />
        /// mm: عدد دو رقمی دقیقه
        /// <para />
        /// m: عدد یک رقمی دقیقه
        /// <para />
        /// ss: ثانیه دو رقمی
        /// <para />
        /// s: ثانیه یک رقمی
        /// <para />
        /// fff: میلی ثانیه 3 رقمی
        /// <para />
        /// ff: میلی ثانیه 2 رقمی
        /// <para />
        /// f: میلی ثانیه یک رقمی
        /// <para />
        /// tt: ب.ظ یا ق.ظ
        /// <para />
        /// t: حرف اول از ب.ظ یا ق.ظ

        format = format.replace(/yyyy/mg, dateTimeJson.year);
        format = format.replace(/yy/mg, dateTimeJson.year % 100);
        format = format.replace(/MMMM/mg, getMonthName(dateTimeJson.month, isGregorian));
        format = format.replace(/MM/mg, zeroPad(dateTimeJson.month));
        format = format.replace(/M/mg, dateTimeJson.month);
        format = format.replace(/dddd/mg, getWeekDayName(dateTimeJson.day, isGregorian));
        format = format.replace(/dd/mg, zeroPad(dateTimeJson.day));
        format = format.replace(/d/mg, dateTimeJson.day);
        format = format.replace(/HH/mg, zeroPad(dateTimeJson.hour));
        format = format.replace(/H/mg, dateTimeJson.hour);
        format = format.replace(/hh/mg, zeroPad(getShortHour(dateTimeJson.hour)));
        format = format.replace(/h/mg, zeroPad(dateTimeJson.hour));
        format = format.replace(/mm/mg, zeroPad(dateTimeJson.minute));
        format = format.replace(/m/mg, dateTimeJson.minute);
        format = format.replace(/ss/mg, zeroPad(dateTimeJson.second));
        format = format.replace(/s/mg, dateTimeJson.second);
        format = format.replace(/fff/mg, zeroPad(dateTimeJson.millisecond, '000'));
        format = format.replace(/ff/mg, zeroPad(dateTimeJson.millisecond / 10));
        format = format.replace(/f/mg, dateTimeJson.millisecond / 100);
        format = format.replace(/tt/mg, getAmPm(dateTimeJson.hour, isGregorian));
        format = format.replace(/t/mg, getAmPm(dateTimeJson.hour, isGregorian)[0]);

        if (!englishNumber) format = toPersianNumber(format);
        return format;
    }

    function getLastDayDateOfPreviousMonth(dateTime, isGregorian) {
        var dateTimeLocal = getClonedDate(dateTime);
        if (isGregorian) {
            var previousMonth = new Date(dateTimeLocal.getFullYear(), dateTimeLocal.getMonth() - 1, 1),
                daysInMonth = getDaysInMonth(previousMonth.getFullYear(), previousMonth.getMonth());
            return new Date(previousMonth.getFullYear(), previousMonth.getMonth(), daysInMonth);
        }
        var dateTimeJsonPersian = getDateTimeJsonPersian1(dateTimeLocal);
        dateTimeJsonPersian.month += -1;
        if (dateTimeJsonPersian.month <= 0) {
            dateTimeJsonPersian.month = 12;
            dateTimeJsonPersian.year--;
        }
        else if (dateTimeJsonPersian.month > 12) {
            dateTimeJsonPersian.year++;
            dateTimeJsonPersian.month = 1;
        }
        return getDateTime1(dateTimeJsonPersian.year, dateTimeJsonPersian.month, getDaysInMonthPersian(dateTimeJsonPersian.year, dateTimeJsonPersian.month));
    }

    function getFirstDayDateOfNextMonth(dateTime, isGregorian) {
        var dateTimeLocal = getClonedDate(dateTime);
        if (isGregorian) {
            var nextMonth = new Date(dateTimeLocal.getFullYear(), dateTimeLocal.getMonth() + 1, 1);
            return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
        }
        var dateTimeJsonPersian = getDateTimeJsonPersian1(dateTimeLocal);
        dateTimeJsonPersian.month += 1;
        if (dateTimeJsonPersian.month <= 0) {
            dateTimeJsonPersian.month = 12;
            dateTimeJsonPersian.year--;
        }
        if (dateTimeJsonPersian.month > 12) {
            dateTimeJsonPersian.year++;
            dateTimeJsonPersian.month = 1;
        }
        return getDateTime1(dateTimeJsonPersian.year, dateTimeJsonPersian.month, 1);
    }

    function parsePersianDateTime(persianDateTimeInString, dateSeperatorPattern) {
        if (!dateSeperatorPattern) dateSeperatorPattern = "\/|-";
        dateSeperatorPattern = new RegExp(dateSeperatorPattern, 'img');
        persianDateTimeInString = toEnglishNumber(persianDateTimeInString);

        var month = 0,
            year = 0,
            day = 0,
            hour = 0,
            minute = 0,
            second = 0,
            miliSecond = 0,
            amPmEnum = amPm.none,
            containMonthSeperator = dateSeperatorPattern.test(persianDateTimeInString);

        persianDateTimeInString = persianDateTimeInString.replace(/&nbsp;/img, ' ');
        persianDateTimeInString = persianDateTimeInString.replace(/\s+/img, '-');
        persianDateTimeInString = persianDateTimeInString.replace(/\\/img, '-');
        persianDateTimeInString = persianDateTimeInString.replace(/ك/img, 'ک');
        persianDateTimeInString = persianDateTimeInString.replace(/ي/img, 'ی');
        persianDateTimeInString = persianDateTimeInString.replace(dateSeperatorPattern, '-');
        persianDateTimeInString = '-' + persianDateTimeInString + '-';

        // بدست آوردن ب.ظ یا ق.ظ
        if (persianDateTimeInString.indexOf('ق.ظ') > -1)
            amPmEnum = amPmEnum.AM;
        else if (persianDateTimeInString.indexOf('ب.ظ') > -1)
            amPmEnum = amPmEnum.PM;

        if (persianDateTimeInString.indexOf(':') > -1) // رشته ورودی شامل ساعت نیز هست
        {
            persianDateTimeInString = persianDateTimeInString.replace(/-*:-*/img, ':');
            hour = (persianDateTimeInString.match(/-\d{1,2}(?=:)/img)[0]).replace(/\D+/, '');
            var minuteAndSecondAndMiliSecondMatch = persianDateTimeInString.match(/:\d{1,2}(?=:?)/img);
            minute = minuteAndSecondAndMiliSecondMatch[0].replace(/\D+/, '');
            if (minuteAndSecondAndMiliSecondMatch[1] != undefined)
                second = minuteAndSecondAndMiliSecondMatch[1].replace(/\D+/, '');
            if (minuteAndSecondAndMiliSecondMatch[2] != undefined)
                miliSecond = minuteAndSecondAndMiliSecondMatch[2].replace(/\D+/, '');
        }

        if (containMonthSeperator) {
            var monthDayMath = persianDateTimeInString.match(/-\d{1,2}(?=-\d{1,2}[^:]|-)/img);

            // بدست آوردن ماه
            month = monthDayMath[0].replace(/\D+/, '');

            // بدست آوردن روز
            day = monthDayMath[1].replace(/\D+/, '');

            // بدست آوردن سال
            year = (persianDateTimeInString.match(/-\d{2,4}(?=-\d{1,2}[^:])/img)[0]).replace(/\D+/, '');
        } else {
            for (var i = 1; i < 12; i++) {
                var persianMonthName = getMonthName(i - 1, false);
                if (persianDateTimeInString.indexOf(persianMonthName) > -1) continue;
                month = i;
                break;
            }

            // بدست آوردن روز
            var dayMatch = persianDateTimeInString.match(/-\d{1,2}(?=-)/img);
            if (dayMatch != null) {
                day = dayMatch[0].replace(/\D+/, '');
                persianDateTimeInString = persianDateTimeInString.replace(new RegExp('-' + day + '(?=-)', 'img'), '-');
            }

            // بدست آوردن سال
            var yearMatch = persianDateTimeInString.match(/-\d{4}(?=-)/img);
            if (yearMatch != null)
                year = yearMatch[0].replace(/\D+/, '');
            else {
                yearMatch = persianDateTimeInString.match(/-\d{2,4}(?=-)/img);
                if (yearMatch != null)
                    year = yearMatch[0].replace(/\D+/, '');
            }
        }

        var numericYear = Number(year);
        var numericMonth = Number(month);
        var numericDay = Number(day);
        var numericHour = Number(hour);
        var numericMinute = Number(minute);
        var numericSecond = Number(second);
        var numericMiliSecond = Number(miliSecond);

        if (numericYear <= 0)
            numericYear = persianDateTime[0];

        if (numericMonth <= 0)
            numericMonth = persianDateTime[1];

        if (numericDay <= 0)
            numericDay = persianDateTime[2];

        switch (amPmEnum) {
            case amPmEnum.PM:
                if (numericHour < 12)
                    numericHour = numericHour + 12;
                break;
            case amPmEnum.AM:
            case amPmEnum.None:
                break;
        }

        return getDateTimeJsonPersian2(numericYear, numericMonth, numericDay, numericHour, numericMinute, numericSecond, numericMiliSecond);
    }

    function parseGregorianDateTime(gregorianDateTimeString) {
        //بدست آوردن تاریخ قبلی که در تکست باکس وجود داشته
        gregorianDateTimeString = toEnglishNumber(gregorianDateTimeString);
        if (!gregorianDateTimeString) {
            var dateTime = new Date();
            dateTime.setHours(0);
            dateTime.setMinutes(0);
            dateTime.setSeconds(0);
            dateTime.setMilliseconds(0);
            return dateTime;
        }
        return new Date(gregorianDateTimeString);
    }

    // Get Html of calendar

    function getDateTimePickerHtml(setting) {
        var selectedDateToShow = getClonedDate(setting.selectedDateToShow),
            html = dateTimePickerHtmlTemplate;

        html = html.replace(/{{rtlCssClass}}/img, setting.isGregorian ? '' : 'rtl');
        html = html.replace(/{{selectedDateStringAttribute}}/img, setting.inLine ? '' : 'hidden');
        html = html.replace(/{{hourText}}/img, setting.isGregorian ? hourText : hourTextPersian);
        html = html.replace(/{{minuteText}}/img, setting.isGregorian ? minuteText : minuteTextPersian);
        html = html.replace(/{{secondText}}/img, setting.isGregorian ? secondText : secondTextPersian);
        html = html.replace(/{{goTodayText}}/img, setting.isGregorian ? goTodayText : goTodayTextPersian);
        html = html.replace(/{{timePickerAttribute}}/img, setting.enableTimePicker ? '' : 'hidden');

        var yearsToSelectHtml = '',
            selectedDateString = '',
            todayDateString = '',
            todayDateTimeJson = {}, // year, month, day, hour, minute, second
            selectedDateTimeJson = {}, 
            selectedDateTimeToShowJson = {},
            disableBeforeDateTimeJson,
            disableAfterDateTimeJson;

        if (setting.isGregorian) {
            selectedDateTimeToShowJson = getDateTimeJson1(selectedDateToShow);
            todayDateTimeJson = getDateTimeJson1(new Date());
            selectedDateTimeJson = setting.selectedDate == undefined ? todayDateTimeJson : getDateTimeJson1(setting.selectedDate);
            disableBeforeDateTimeJson = !setting.disableBeforeDate ? undefined : getDateTimeJson1(setting.disableBeforeDate);
            disableAfterDateTimeJson = !setting.disableAfterDate ? undefined : getDateTimeJson1(setting.disableAfterDate);
        } else {
            selectedDateTimeToShowJson = getDateTimeJsonPersian1(selectedDateToShow);
            todayDateTimeJson = getDateTimeJsonPersian1(new Date());
            selectedDateTimeJson = setting.selectedDate == undefined ? todayDateTimeJson : getDateTimeJsonPersian1(setting.selectedDate);
            disableBeforeDateTimeJson = !setting.disableBeforeDate ? undefined : getDateTimeJsonPersian1(setting.disableBeforeDate);
            disableAfterDateTimeJson = !setting.disableAfterDate ? undefined : getDateTimeJsonPersian1(setting.disableAfterDate);
        }

        // بررسی پراپرتی های از تاریخ، تا تاریخ
        if ((setting.fromDate || setting.toDate) && setting.groupId) {
            var $toDateElement = $('[' + mdDatePickerGroupIdAttribute + '="' + setting.groupId + '"][data-toDate]'),
                $fromDateElement = $('[' + mdDatePickerGroupIdAttribute + '="' + setting.groupId + '"][data-fromDate]');
            if (setting.fromDate) {
                var toDateSetting = getSetting2($toDateElement),
                    toDateSelectedDate = toDateSetting.selectedDate;
                disableAfterDateTimeJson = !toDateSelectedDate ? undefined : setting.isGregorian ? getDateTimeJson1(toDateSelectedDate) : getDateTimeJsonPersian1(toDateSelectedDate);
            }
            else if (setting.toDate) {
                var fromDateSetting = getSetting2($fromDateElement),
                    fromDateSelectedDate = fromDateSetting.selectedDate;
                disableBeforeDateTimeJson = !fromDateSelectedDate ? undefined : setting.isGregorian ? getDateTimeJson1(fromDateSelectedDate) : getDateTimeJsonPersian1(fromDateSelectedDate);
            }
        }

        selectedDateString = `${getWeekDayName(selectedDateTimeJson.dayOfWeek, setting.isGregorian)}، ${selectedDateTimeJson.day} ${getMonthName(selectedDateTimeJson.month - 1, setting.isGregorian)} ${selectedDateTimeJson.year}`;
        todayDateString = `${setting.isGregorian ? 'Today,' : 'امروز،'} ${todayDateTimeJson.day} ${getMonthName(todayDateTimeJson.month - 1, setting.isGregorian)} ${todayDateTimeJson.year}`;
        if (!setting.englishNumber) {
            selectedDateString = toPersianNumber(selectedDateString);
            todayDateString = toPersianNumber(todayDateString);
        }

        for (var i = todayDateTimeJson.year - setting.yearOffset; i < todayDateTimeJson.year + setting.yearOffset; i++) {
            if (setting.disableBeforeToday && i < todayDateTimeJson.year) continue;
            if (setting.disableAfterToday && i > todayDateTimeJson.year) continue;
            if (disableBeforeDateTimeJson != undefined && disableBeforeDateTimeJson.year != undefined && i < disableBeforeDateTimeJson.year) continue;
            if (disableAfterDateTimeJson != undefined && disableAfterDateTimeJson.year != undefined && i > disableAfterDateTimeJson.year) continue;
            var currentYearDateTimeNumber = convertToNumber2(i, selectedDateTimeToShowJson.month, getDaysInMonthPersian(i, selectedDateTimeToShowJson.month)),
                currentYearDisabledAttr = '',
                yearText = setting.englishNumber ? i.toString() : toPersianNumber(i),
                yearDateNumber = convertToNumber2(i, selectedDateTimeToShowJson.month, 1);
            if (disableBeforeDateTimeJson != undefined && disableBeforeDateTimeJson.year != undefined && currentYearDateTimeNumber < convertToNumber1(disableBeforeDateTimeJson))
                currentYearDisabledAttr = 'disabled';
            if (disableAfterDateTimeJson != undefined && disableAfterDateTimeJson.year != undefined && currentYearDateTimeNumber < convertToNumber1(disableAfterDateTimeJson))
                currentYearDisabledAttr = 'disabled';
            if (setting.disableBeforeToday && currentYearDateTimeNumber < convertToNumber1(todayDateTimeJson))
                currentYearDisabledAttr = 'disabled';
            if (setting.disableAfterToday && currentYearDateTimeNumber > convertToNumber1(todayDateTimeJson))
                currentYearDisabledAttr = 'disabled';
            yearsToSelectHtml += `
<div class="col-3 text-center" ${selectedDateTimeToShowJson.year == i ? 'selected-year' : ''}>
    <button class="btn btn-sm btn-light" type="button" data-changedatebutton data-number="${yearDateNumber}" ${currentYearDisabledAttr}>${yearText}</button>
</div>`;
        }

        if (disableAfterDateTimeJson != undefined && disableAfterDateTimeJson.month < selectedDateTimeToShowJson.month)
            selectedDateToShow = setting.isGregorian ? new Date(disableAfterDateTimeJson.year, disableAfterDateTimeJson.month - 1, 1) : getDateTime1(disableAfterDateTimeJson.year, disableAfterDateTimeJson.month, disableAfterDateTimeJson.day);

        if (disableBeforeDateTimeJson != undefined && disableBeforeDateTimeJson.month > selectedDateTimeToShowJson.month)
            selectedDateToShow = setting.isGregorian ? new Date(disableBeforeDateTimeJson.year, disableBeforeDateTimeJson.month - 1, 1) : getDateTime1(disableBeforeDateTimeJson.year, disableBeforeDateTimeJson.month, disableBeforeDateTimeJson.day);

        var monthsTdHtml = '',
            numberOfNextMonths = setting.monthsToShow[1] <= 0 ? 0 : setting.monthsToShow[1],
            numberOfPrevMonths = setting.monthsToShow[0] <= 0 ? 0 : setting.monthsToShow[0];
        numberOfPrevMonths *= -1;
        for (var i1 = numberOfPrevMonths; i1 < 0; i1++) {
            setting.selectedDateToShow = addMonthToDateTime(getClonedDate(selectedDateToShow), i1);
            monthsTdHtml += getDateTimePickerMonthHtml1(setting, false, true);
        }
        setting.selectedDateToShow = getClonedDate(selectedDateToShow);
        monthsTdHtml += getDateTimePickerMonthHtml1(setting, false, false);
        for (var i2 = 1; i2 <= numberOfNextMonths; i2++) {
            setting.selectedDateToShow = addMonthToDateTime(getClonedDate(selectedDateToShow), i2);
            monthsTdHtml += getDateTimePickerMonthHtml1(setting, true, false);
        }

        var totalMonthNumberToShow = Math.abs(numberOfPrevMonths) + 1 + numberOfNextMonths,
            monthTdStyle = totalMonthNumberToShow > 1 ? 'width: ' + (100 / totalMonthNumberToShow).toString() + '%;' : '';

        monthsTdHtml = monthsTdHtml.replace(/{{monthTdStyle}}/img, monthTdStyle);

        html = html.replace(/{{yearsToSelectHtml}}/img, yearsToSelectHtml);
        html = html.replace(/{{selectedDateString}}/img, selectedDateString);
        html = html.replace(/{{todayDateString}}/img, todayDateString);
        html = html.replace(/{{hour}}/img, selectedDateTimeToShowJson.hour);
        html = html.replace(/{{minute}}/img, selectedDateTimeToShowJson.minute);
        html = html.replace(/{{second}}/img, selectedDateTimeToShowJson.second);
        html = html.replace(/{{monthsTdHtml}}/img, monthsTdHtml);

        return html;
    }
    function getDateTimePickerMonthHtml1(setting, isNextMonth, isPrevMonth) {
        var selectedDateToShow = getClonedDate(setting.selectedDateToShow);
        var selectedDateToShowTemp = getClonedDate(selectedDateToShow),
            selectedDateTime = setting.selectedDate != undefined ? getClonedDate(setting.selectedDate) : undefined,
            isNextOrPrevMonth = isNextMonth || isPrevMonth,
            html = dateTimePickerMonthTableHtmlTemplate;

        html = html.replace(/{{monthTdAttribute}}/img, isNextMonth ? 'data-next-month' : isPrevMonth ? 'data-prev-month' : '');
        html = html.replace(/{{monthNameAttribute}}/img, !isNextOrPrevMonth ? 'hidden' : '');
        html = html.replace(/{{theadSelectDateButtonTrAttribute}}/img, setting.inLine || !isNextOrPrevMonth ? '' : 'hidden');
        html = html.replace(/{{weekDayShortName1CssClass}}/img, setting.isGregorian ? 'text-danger' : '');
        html = html.replace(/{{weekDayShortName7CssClass}}/img, !setting.isGregorian ? 'text-danger' : '');
        html = html.replace(/{{previousYearText}}/img, setting.isGregorian ? previousYearText : previousYearTextPersian);
        html = html.replace(/{{previousMonthText}}/img, setting.isGregorian ? previousMonthText : previousMonthTextPersian);
        html = html.replace(/{{nextMonthText}}/img, setting.isGregorian ? nextMonthText : nextMonthTextPersian);
        html = html.replace(/{{nextYearText}}/img, setting.isGregorian ? nextYearText : nextYearTextPersian);
        html = html.replace(/{{monthName1}}/img, getMonthName(0, setting.isGregorian));
        html = html.replace(/{{monthName2}}/img, getMonthName(1, setting.isGregorian));
        html = html.replace(/{{monthName3}}/img, getMonthName(2, setting.isGregorian));
        html = html.replace(/{{monthName4}}/img, getMonthName(3, setting.isGregorian));
        html = html.replace(/{{monthName5}}/img, getMonthName(4, setting.isGregorian));
        html = html.replace(/{{monthName6}}/img, getMonthName(5, setting.isGregorian));
        html = html.replace(/{{monthName7}}/img, getMonthName(6, setting.isGregorian));
        html = html.replace(/{{monthName8}}/img, getMonthName(7, setting.isGregorian));
        html = html.replace(/{{monthName9}}/img, getMonthName(8, setting.isGregorian));
        html = html.replace(/{{monthName10}}/img, getMonthName(9, setting.isGregorian));
        html = html.replace(/{{monthName11}}/img, getMonthName(10, setting.isGregorian));
        html = html.replace(/{{monthName12}}/img, getMonthName(11, setting.isGregorian));
        html = html.replace(/{{weekDayShortName1}}/img, getWeekDayShortName(0, setting.isGregorian));
        html = html.replace(/{{weekDayShortName2}}/img, getWeekDayShortName(1, setting.isGregorian));
        html = html.replace(/{{weekDayShortName3}}/img, getWeekDayShortName(2, setting.isGregorian));
        html = html.replace(/{{weekDayShortName4}}/img, getWeekDayShortName(3, setting.isGregorian));
        html = html.replace(/{{weekDayShortName5}}/img, getWeekDayShortName(4, setting.isGregorian));
        html = html.replace(/{{weekDayShortName6}}/img, getWeekDayShortName(5, setting.isGregorian));
        html = html.replace(/{{weekDayShortName7}}/img, getWeekDayShortName(6, setting.isGregorian));

        var i = 0, j = 0,
            firstWeekDayNumber,
            cellNumber = 0,
            tdNumber = 0,
            selectedYear = 0,
            selectedDateNumber = 0,
            selectedMonthName = '',
            todayDateTimeJson = {}, // year, month, day, hour, minute, second
            dateTimeToShowJson = {}, // year, month, day, hour, minute, second
            numberOfDaysInCurrentMonth,
            $tr = $('<tr />'),
            $td = $('<td />'),
            daysHtml = '',
            currentDateNumber = 0,
            currentMonthInfo = '',
            previousMonthDateNumber = 0,
            nextMonthDateNumber = 0,
            previousYearDateNumber = 0,
            nextYearDateNumber = 0,
            disableBeforeDateTimeNumber = 0,
            disableAfterDateTimeNumber = 0,
            dayNumberInString = '0',
            dayOfWeek = '', // نام روز هفته
            monthsDateNumberAndAttr = {
                month1DateNumber: 0,
                month2DateNumber: 0,
                month3DateNumber: 0,
                month4DateNumber: 0,
                month5DateNumber: 0,
                month6DateNumber: 0,
                month7DateNumber: 0,
                month8DateNumber: 0,
                month9DateNumber: 0,
                month10DateNumber: 0,
                month11DateNumber: 0,
                month12DateNumber: 0,
                selectMonth1ButtonCssClass: '',
                selectMonth2ButtonCssClass: '',
                selectMonth3ButtonCssClass: '',
                selectMonth4ButtonCssClass: '',
                selectMonth5ButtonCssClass: '',
                selectMonth6ButtonCssClass: '',
                selectMonth7ButtonCssClass: '',
                selectMonth8ButtonCssClass: '',
                selectMonth9ButtonCssClass: '',
                selectMonth10ButtonCssClass: '',
                selectMonth11ButtonCssClass: '',
                selectMonth12ButtonCssClass: '',
            },
            holiDaysDateNumbers = [],
            disableBeforeDateTimeJson = {},
            disableAfterDateTimeJson = {},
            previousYearButtonDisabledAttribute = '',
            previousMonthButtonDisabledAttribute = '',
            selectYearButtonDisabledAttribute = '',
            nextMonthButtonDisabledAttribute = '',
            nextYearButtonDisabledAttribute = '';

        if (setting.isGregorian) {
            dateTimeToShowJson = getDateTimeJson1(selectedDateToShowTemp);
            todayDateTimeJson = getDateTimeJson1(new Date());
            disableBeforeDateTimeJson = !setting.disableBeforeDate ? undefined : getDateTimeJson1(setting.disableBeforeDate);
            disableAfterDateTimeJson = !setting.disableAfterDate ? undefined : getDateTimeJson1(setting.disableAfterDate);
            firstWeekDayNumber = new Date(dateTimeToShowJson.year, dateTimeToShowJson.month - 1, 1).getDay();
            selectedDateNumber = !selectedDateTime ? 0 : convertToNumber1(getDateTimeJson1(selectedDateTime));
            numberOfDaysInCurrentMonth = getDaysInMonth(dateTimeToShowJson.year, dateTimeToShowJson.month - 1);
            numberOfDaysInPreviousMonth = getDaysInMonth(dateTimeToShowJson.year, dateTimeToShowJson.month - 2);
            previousMonthDateNumber = convertToNumber1(getDateTimeJson1(getLastDayDateOfPreviousMonth(selectedDateToShowTemp, true)));
            nextMonthDateNumber = convertToNumber1(getDateTimeJson1(getFirstDayDateOfNextMonth(selectedDateToShowTemp, true)));
            selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            previousYearDateNumber = convertToNumber1(getDateTimeJson1(new Date(selectedDateToShowTemp.setFullYear(selectedDateToShowTemp.getFullYear() - 1))));
            selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            nextYearDateNumber = convertToNumber1(getDateTimeJson1(new Date(selectedDateToShowTemp.setFullYear(selectedDateToShowTemp.getFullYear() + 1))));
            selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            for (i = 1; i <= 12; i++) {
                monthsDateNumberAndAttr['month' + i.toString() + 'DateNumber'] = convertToNumber1(getDateTimeJson1(new Date(selectedDateToShowTemp.setMonth(i - 1))));
                selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            }
            for (i = 0; i < setting.holiDays.length; i++) {
                holiDaysDateNumbers.push(convertToNumber1(getDateTimeJson1(setting.holiDays[i])));
            }
        } else {
            dateTimeToShowJson = getDateTimeJsonPersian1(selectedDateToShowTemp);
            todayDateTimeJson = getDateTimeJsonPersian1(new Date());
            disableBeforeDateTimeJson = !setting.disableBeforeDate ? undefined : getDateTimeJsonPersian1(setting.disableBeforeDate);
            disableAfterDateTimeJson = !setting.disableAfterDate ? undefined : getDateTimeJsonPersian1(setting.disableAfterDate);
            firstWeekDayNumber = getDateTimeJsonPersian2(dateTimeToShowJson.year, dateTimeToShowJson.month, 1, 0, 0, 0).dayOfWeek;
            selectedDateNumber = !selectedDateTime ? 0 : convertToNumber1(getDateTimeJsonPersian1(selectedDateTime));
            numberOfDaysInCurrentMonth = getDaysInMonthPersian(dateTimeToShowJson.year, dateTimeToShowJson.month);
            numberOfDaysInPreviousMonth = getDaysInMonthPersian(dateTimeToShowJson.year - 1, dateTimeToShowJson.month - 1);
            previousMonthDateNumber = convertToNumber1(getDateTimeJsonPersian1(getLastDayDateOfPreviousMonth(selectedDateToShowTemp, false)));
            selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            nextMonthDateNumber = convertToNumber1(getDateTimeJsonPersian1(getFirstDayDateOfNextMonth(selectedDateToShowTemp, false)));
            selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            previousYearDateNumber = convertToNumber2(dateTimeToShowJson.year - 1, dateTimeToShowJson.month, dateTimeToShowJson.day);
            nextYearDateNumber = convertToNumber2(dateTimeToShowJson.year + 1, dateTimeToShowJson.month, dateTimeToShowJson.day);
            selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            for (i = 1; i <= 12; i++) {
                monthsDateNumberAndAttr['month' + i.toString() + 'DateNumber'] = convertToNumber2(dateTimeToShowJson.year, i, getDaysInMonthPersian(i));
                selectedDateToShowTemp = getClonedDate(selectedDateToShow);
            }
            for (i = 0; i < setting.holiDays.length; i++) {
                holiDaysDateNumbers.push(convertToNumber1(getDateTimeJsonPersian1(setting.holiDays[i])));
            }
        }

        // بررسی پراپرتی های از تاریخ، تا تاریخ
        if ((setting.fromDate || setting.toDate) && setting.groupId) {
            var $toDateElement = $('[' + mdDatePickerGroupIdAttribute + '="' + setting.groupId + '"][data-toDate]'),
                $fromDateElement = $('[' + mdDatePickerGroupIdAttribute + '="' + setting.groupId + '"][data-fromDate]');
            if (setting.fromDate) {
                var toDateSetting = getSetting2($toDateElement),
                    toDateSelectedDate = toDateSetting.selectedDate;
                disableAfterDateTimeJson = !toDateSelectedDate ? undefined : setting.isGregorian ? getDateTimeJson1(toDateSelectedDate) : getDateTimeJsonPersian1(toDateSelectedDate);
            }
            else if (setting.toDate) {
                var fromDateSetting = getSetting2($fromDateElement),
                    fromDateSelectedDate = fromDateSetting.selectedDate;
                disableBeforeDateTimeJson = !fromDateSelectedDate ? undefined : setting.isGregorian ? getDateTimeJson1(fromDateSelectedDate) : getDateTimeJsonPersian1(fromDateSelectedDate);
            }
        }

        var todayDateNumber = convertToNumber1(todayDateTimeJson);

        selectedYear = setting.englishNumber ? dateTimeToShowJson.year : toPersianNumber(dateTimeToShowJson.year);
        disableBeforeDateTimeNumber = !disableBeforeDateTimeJson ? undefined : convertToNumber1(disableBeforeDateTimeJson);
        disableAfterDateTimeNumber = !disableAfterDateTimeJson ? undefined : convertToNumber1(disableAfterDateTimeJson);
        currentMonthInfo = getMonthName(dateTimeToShowJson.month - 1, setting.isGregorian) + ' ' + dateTimeToShowJson.year.toString();
        if (!setting.englishNumber) currentMonthInfo = toPersianNumber(currentMonthInfo);
        selectedMonthName = getMonthName(dateTimeToShowJson.month - 1, setting.isGregorian);

        if (setting.yearOffset <= 0) {
            previousYearButtonDisabledAttribute = 'disabled';
            nextYearButtonDisabledAttribute = 'disabled';
            selectYearButtonDisabledAttribute = 'disabled';
        }

        // روز های ماه قبل
        if (firstWeekDayNumber != 6) {
            if (setting.isGregorian) firstWeekDayNumber--;
            var previousMonthDateTimeJson = addMonthToDateTimeJson(dateTimeToShowJson, -1, setting.isGregorian);
            for (i = numberOfDaysInPreviousMonth - firstWeekDayNumber; i <= numberOfDaysInPreviousMonth; i++) {
                dayNumberInString = setting.englishNumber ? zeroPad(i) : toPersianNumber(zeroPad(i));
                $td = $('<td data-nm />')
                    .attr('data-number', convertToNumber2(previousMonthDateTimeJson.year, previousMonthDateTimeJson.month, i))
                    .html(dayNumberInString);
                // روز جمعه
                if (!setting.isGregorian && tdNumber == 6)
                    $td.addClass('text-danger');
                // روز یکشنبه
                else if (setting.isGregorian && tdNumber == 0)
                    $td.addClass('text-danger');
                $tr.append($td);
                cellNumber++;
                tdNumber++;
                if (tdNumber >= 7) {
                    tdNumber = 0;
                    daysHtml += $tr[0].outerHTML;
                    isTrAppended = true;
                    $tr = $('<tr />');
                }
            }
        }

        // روزهای ماه جاری
        for (i = 1; i <= numberOfDaysInCurrentMonth; i++) {

            if (tdNumber >= 7) {
                tdNumber = 0;
                daysHtml += $tr[0].outerHTML;
                isTrAppended = true;
                $tr = $('<tr />');
            }

            // عدد روز
            currentDateNumber = convertToNumber2(dateTimeToShowJson.year, dateTimeToShowJson.month, i);
            dayNumberInString = setting.englishNumber ? zeroPad(i) : toPersianNumber(zeroPad(i));

            $td = $('<td data-day />')
                .attr('data-number', currentDateNumber)
                .html(dayNumberInString);

            // امروز
            if (currentDateNumber == todayDateNumber) {
                $td.attr('data-today', '');
                // اگر نام روز هفته انتخاب شده در تکس باکس قبل از تاریخ امروز باشد
                // نباید دیگر نام روز هفته تغییر کند
                if (!dayOfWeek)
                    dayOfWeek = getWeekDayName(tdNumber - 1 < 0 ? 0 : tdNumber - 1, setting.isGregorian);
            }
            // روز از قبل انتخاب شده
            if (selectedDateNumber == currentDateNumber) {
                $td.attr('data-selectedday', '');
                dayOfWeek = getWeekDayName(tdNumber - 1 < 0 ? 0 : tdNumber - 1, setting.isGregorian);
            }

            // روزهای تعطیل
            for (j = 0; j < holiDaysDateNumbers.length; j++) {
                if (holiDaysDateNumbers[j] != currentDateNumber) continue;
                $td.addClass('text-danger');
                break;
            }

            // روز جمعه
            if (!setting.isGregorian && tdNumber == 6)
                $td.addClass('text-danger');
            // روز یکشنبه
            else if (setting.isGregorian && tdNumber == 0)
                $td.addClass('text-danger');

            // روزهای غیر فعال شده
            if (setting.disableBeforeToday) {
                if (currentDateNumber < todayDateNumber) $td.attr('disabled', '');
                if (nextMonthDateNumber < todayDateNumber)
                    nextMonthButtonDisabledAttribute = 'disabled';
                if (nextYearDateNumber < todayDateNumber)
                    nextYearButtonDisabledAttribute = 'disabled';
                if (previousMonthDateNumber < todayDateNumber)
                    previousMonthButtonDisabledAttribute = 'disabled';
                if (previousYearDateNumber < todayDateNumber)
                    previousYearButtonDisabledAttribute = 'disabled';
                for (j = 1; j <= 12; j++) {
                    if (monthsDateNumberAndAttr['month' + j.toString() + 'DateNumber'] < todayDateNumber)
                        monthsDateNumberAndAttr['selectMonth' + j.toString() + 'ButtonCssClass'] = 'disabled';
                }
            }
            if (setting.disableAfterToday) {
                if (currentDateNumber > todayDateNumber) $td.attr('disabled', '');
                if (nextMonthDateNumber > todayDateNumber)
                    nextMonthButtonDisabledAttribute = 'disabled';
                if (nextYearDateNumber > todayDateNumber)
                    nextYearButtonDisabledAttribute = 'disabled';
                if (previousMonthDateNumber > todayDateNumber)
                    previousMonthButtonDisabledAttribute = 'disabled';
                if (previousYearDateNumber > todayDateNumber)
                    previousYearButtonDisabledAttribute = 'disabled';
                for (j = 1; j <= 12; j++) {
                    if (monthsDateNumberAndAttr['month' + j.toString() + 'DateNumber'] > todayDateNumber)
                        monthsDateNumberAndAttr['selectMonth' + j.toString() + 'ButtonCssClass'] = 'disabled';
                }
            }
            if (disableAfterDateTimeNumber) {
                if (currentDateNumber > disableAfterDateTimeNumber) $td.attr('disabled', '');
                if (nextMonthDateNumber > disableAfterDateTimeNumber)
                    nextMonthButtonDisabledAttribute = 'disabled';
                if (nextYearDateNumber > disableAfterDateTimeNumber)
                    nextYearButtonDisabledAttribute = 'disabled';
                if (previousMonthDateNumber > disableAfterDateTimeNumber)
                    previousMonthButtonDisabledAttribute = 'disabled';
                if (previousYearDateNumber > disableAfterDateTimeNumber)
                    previousYearButtonDisabledAttribute = 'disabled';
                for (j = 1; j <= 12; j++) {
                    if (monthsDateNumberAndAttr['month' + j.toString() + 'DateNumber'] > disableAfterDateTimeNumber)
                        monthsDateNumberAndAttr['selectMonth' + j.toString() + 'ButtonCssClass'] = 'disabled';
                }
            }
            if (disableBeforeDateTimeNumber) {
                if (currentDateNumber < disableBeforeDateTimeNumber) $td.attr('disabled', '');
                if (nextMonthDateNumber < disableBeforeDateTimeNumber)
                    nextMonthButtonDisabledAttribute = 'disabled';
                if (nextYearDateNumber < disableBeforeDateTimeNumber)
                    nextYearButtonDisabledAttribute = 'disabled';
                if (previousMonthDateNumber < disableBeforeDateTimeNumber)
                    previousMonthButtonDisabledAttribute = 'disabled';
                if (previousYearDateNumber < disableBeforeDateTimeNumber)
                    previousYearButtonDisabledAttribute = 'disabled';
                for (j = 1; j <= 12; j++) {
                    if (monthsDateNumberAndAttr['month' + j.toString() + 'DateNumber'] < disableBeforeDateTimeNumber)
                        monthsDateNumberAndAttr['selectMonth' + j.toString() + 'ButtonCssClass'] = 'disabled';
                }
            }
            if (setting.disabledDates.length > 0) {
                for (j = 0; j < setting.disabledDates.length; j++) {
                    var disabledDattenumber = convertToNumber1(setting.disabledDates[j]);
                    if (currentDateNumber == disabledDattenumber)
                        $td.attr('disabled', '');
                }
            }
            // \\

            $tr.append($td);
            isTrAppended = false;

            tdNumber++;
            cellNumber++;
        }

        if (tdNumber >= 7) {
            tdNumber = 0;
            daysHtml += $tr[0].outerHTML;
            isTrAppended = true;
            $tr = $('<tr />');
        }

        // روزهای ماه بعد
        var nextMonthDateTimeJson = addMonthToDateTimeJson(dateTimeToShowJson, 1, setting.isGregorian);
        for (i = 1; i <= 42 - cellNumber; i++) {
            dayNumberInString = setting.englishNumber ? zeroPad(i) : toPersianNumber(zeroPad(i));
            $td = $('<td data-nm />')
                .attr('data-number', convertToNumber2(nextMonthDateTimeJson.year, nextMonthDateTimeJson.month, i))
                .html(dayNumberInString);
            // روز جمعه
            if (!setting.isGregorian && tdNumber == 6)
                $td.addClass('text-danger');
            // روز یکشنبه
            else if (setting.isGregorian && tdNumber == 0)
                $td.addClass('text-danger');
            $tr.append($td);
            tdNumber++;
            if (tdNumber >= 7) {
                tdNumber = 0;
                daysHtml += $tr[0].outerHTML;
                isTrAppended = true;
                $tr = $('<tr />');
            }
        }

        if (!isTrAppended) {
            daysHtml += $tr[0].outerHTML;
            isTrAppended = true;
        }

        html = html.replace(/{{currentMonthInfo}}/img, currentMonthInfo);
        html = html.replace(/{{selectedYear}}/img, selectedYear);
        html = html.replace(/{{selectedMonthName}}/img, selectedMonthName);
        html = html.replace(/{{daysHtml}}/img, daysHtml);
        html = html.replace(/{{previousYearButtonDisabledAttribute}}/img, previousYearButtonDisabledAttribute);
        html = html.replace(/{{previousYearButtonDateNumber}}/img, previousYearDateNumber);
        html = html.replace(/{{previousMonthButtonDisabledAttribute}}/img, previousMonthButtonDisabledAttribute);
        html = html.replace(/{{previousMonthButtonDateNumber}}/img, previousMonthDateNumber);
        html = html.replace(/{{selectYearButtonDisabledAttribute}}/img, selectYearButtonDisabledAttribute);
        html = html.replace(/{{nextMonthButtonDisabledAttribute}}/img, nextMonthButtonDisabledAttribute);
        html = html.replace(/{{nextMonthButtonDateNumber}}/img, nextMonthDateNumber);
        html = html.replace(/{{nextYearButtonDisabledAttribute}}/img, nextYearButtonDisabledAttribute);
        html = html.replace(/{{nextYearButtonDateNumber}}/img, nextYearDateNumber);
        html = html.replace(/{{dropDownMenuMonth1DateNumber}}/img, monthsDateNumberAndAttr.month1DateNumber);
        html = html.replace(/{{dropDownMenuMonth2DateNumber}}/img, monthsDateNumberAndAttr.month2DateNumber);
        html = html.replace(/{{dropDownMenuMonth3DateNumber}}/img, monthsDateNumberAndAttr.month3DateNumber);
        html = html.replace(/{{dropDownMenuMonth4DateNumber}}/img, monthsDateNumberAndAttr.month4DateNumber);
        html = html.replace(/{{dropDownMenuMonth5DateNumber}}/img, monthsDateNumberAndAttr.month5DateNumber);
        html = html.replace(/{{dropDownMenuMonth6DateNumber}}/img, monthsDateNumberAndAttr.month6DateNumber);
        html = html.replace(/{{dropDownMenuMonth7DateNumber}}/img, monthsDateNumberAndAttr.month7DateNumber);
        html = html.replace(/{{dropDownMenuMonth8DateNumber}}/img, monthsDateNumberAndAttr.month8DateNumber);
        html = html.replace(/{{dropDownMenuMonth9DateNumber}}/img, monthsDateNumberAndAttr.month9DateNumber);
        html = html.replace(/{{dropDownMenuMonth10DateNumber}}/img, monthsDateNumberAndAttr.month10DateNumber);
        html = html.replace(/{{dropDownMenuMonth11DateNumber}}/img, monthsDateNumberAndAttr.month11DateNumber);
        html = html.replace(/{{dropDownMenuMonth12DateNumber}}/img, monthsDateNumberAndAttr.month12DateNumber);
        html = html.replace(/{{selectMonth1ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth1ButtonCssClass);
        html = html.replace(/{{selectMonth2ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth2ButtonCssClass);
        html = html.replace(/{{selectMonth3ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth3ButtonCssClass);
        html = html.replace(/{{selectMonth4ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth4ButtonCssClass);
        html = html.replace(/{{selectMonth5ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth5ButtonCssClass);
        html = html.replace(/{{selectMonth6ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth6ButtonCssClass);
        html = html.replace(/{{selectMonth7ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth7ButtonCssClass);
        html = html.replace(/{{selectMonth8ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth8ButtonCssClass);
        html = html.replace(/{{selectMonth9ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth9ButtonCssClass);
        html = html.replace(/{{selectMonth10ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth10ButtonCssClass);
        html = html.replace(/{{selectMonth11ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth11ButtonCssClass);
        html = html.replace(/{{selectMonth12ButtonCssClass}}/img, monthsDateNumberAndAttr.selectMonth12ButtonCssClass);

        return html;
    }

    //#endregion

    //#region Events

    // کلیک روی روزها
    $(document).on('click', mdDatePickerContainerSelector + ' [data-day]', function () {
        var $this = $(this),
            disabled = $this.attr('disabled'),
            dateNumber = Number($this.attr('data-number')),
            setting = getSetting1($this),
            selectedDateToShow = getClonedDate(setting.selectedDateToShow);
        if (disabled) return;
        selectedDateToShow = getDateTime4(dateNumber, selectedDateToShow, setting);
        setting.selectedDate = getClonedDate(selectedDateToShow);
        setting.selectedDateToShow = getClonedDate(selectedDateToShow);
        setSetting1($this, setting);
        setSelectedText(setting);
        if (!setting.inLine) hidePopover($(mdDatePickerPopoverSelector));
        else updateCalendarHtml1($this, setting);
    });

    // کلیک روی دکمه هایی که تاریخ را تغییر می دهند
    $(document).on('click', mdDatePickerContainerSelector + ' [data-changedatebutton]', function () {
        var $this = $(this),
            disabled = $this.attr('disabled'),
            dateNumber = Number($this.attr('data-number')),
            setting = getSetting1($this),
            selectedDateToShow = getClonedDate(setting.selectedDateToShow);
        if (disabled) return;
        selectedDateToShow = getDateTime4(dateNumber, selectedDateToShow, setting);
        setting.selectedDateToShow = getClonedDate(selectedDateToShow);
        setSetting1($this, setting);
        updateCalendarHtml1($this, setting);
    });

    // عوض کردن ساعت
    $(document).on('blur', mdDatePickerContainerSelector + ' input[data-clock]', function () {
        var $this = $(this),
            $thisContainer = $this.parents(mdDatePickerContainerSelector + ':first'),
            $hour = $thisContainer.find('input[type="text"][data-clock="hour"]'),
            $minute = $thisContainer.find('input[type="text"][data-clock="minute"]'),
            $second = $thisContainer.find('input[type="text"][data-clock="second"]'),
            hour = Number($hour.val()),
            minute = Number($minute.val()),
            second = Number($second.val()),
            setting = getSetting1($this);

        if (!setting.enableTimePicker) return;

        hour = !isNumber(hour) ? setting.selectedDateToShow.getHours() : hour;
        minute = !isNumber(minute) ? setting.selectedDateToShow.getMinutes() : minute;
        second = !isNumber(second) ? setting.selectedDateToShow.getSeconds() : second;

        setting.selectedDate = new Date(setting.selectedDate.setHours(hour));
        setting.selectedDate = new Date(setting.selectedDate.setMinutes(minute));
        setting.selectedDate = new Date(setting.selectedDate.setSeconds(second));

        setSetting1($this, setting);
        setSelectedText(setting);
    });

    // کلیک روی سال انتخابی برای عوض کردن سال
    $(document).on('click', mdDatePickerContainerSelector + ' [select-year-button]', function () {
        $(this).parents(mdDatePickerContainerSelector + ':first').find('.select-year-box').removeClass('w-0');
    });

    // برو به امروز
    $(document).on('click', mdDatePickerContainerSelector + ' [data-go-today]', function () {
        var $this = $(this),
            setting = getSetting1($this);
        setting.selectedDateToShow = new Date();
        setSetting1($this, setting);
        updateCalendarHtml1($this, setting);
    });

    // مخفی کردن تقویم با کلیک روی جایی که تقویم نیست
    $('html').on('click', function (e) {
        if (triggerStart) return;
        var $target = $(e.target),
            $popoverDescriber = getPopoverDescriber($target);
        if ($popoverDescriber.length >= 1) return;
        hidePopover($(mdDatePickerPopoverSelector));
    });

    //#endregion

    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this),
                    setting = $.extend({
                        englishNumber: false,
                        placement: 'bottom',
                        trigger: 'click',
                        enableTimePicker: false,
                        targetSelector: '',
                        toDate: false,
                        fromDate: false,
                        groupId: '',
                        disabled: false,
                        format: '',
                        isGregorian: false,
                        inLine: false,
                        selectedDate: undefined,
                        selectedDateToShow: new Date(),
                        monthsToShow: [0, 0],
                        yearOffset: 30,
                        holiDays: [],
                        disabledDates: [],
                        disableBeforeToday: false,
                        disableAfterToday: false,
                        disableBeforeDate: undefined,
                        disableAfterDate: undefined
                    }, options);
                $this.attr(mdDatePickerFlag, '');
                if ((setting.fromDate || setting.toDate) && setting.groupId) {
                    $this.attr(mdDatePickerGroupIdAttribute, setting.groupId);
                    if (setting.toDate) $this.attr('data-toDate', '');
                    else if (setting.fromDate) $this.attr('data-fromDate', '');
                }
                if (setting.isGregorian) setting.englishNumber = true;
                if (setting.disable) $this.attr('disabled', '');
                if (setting.enableTimePicker && !setting.format) setting.format = 'yyyy/MM/dd   HH:mm:ss';
                else if (!setting.enableTimePicker && !setting.format) setting.format = 'yyyy/MM/dd';
                $this.data(mdPluginName, setting);
                // نمایش تقویم
                if (setting.inLine) {
                    $this.append(getDateTimePickerHtml(setting));
                } else {
                    $this.popover({
                        container: 'body',
                        content: '',
                        html: true,
                        placement: setting.placement,
                        title: 'انتخاب تاریخ',
                        trigger: 'manual',
                        template: popverHtmlTemplate,
                    }).on(setting.trigger, function () {
                        triggerStart = true;
                        $this = $(this);
                        setting = $this.data(mdPluginName);
                        if (setting.disabled) return;
                        hideOthers($this);
                        showPopover($this);
                        setTimeout(function () {
                            setting.selectedDateToShow = setting.selectedDate != undefined ? getClonedDate(setting.selectedDate) : new Date();
                            var calendarHtml = getDateTimePickerHtml(setting),
                                selectedDateString = $(calendarHtml).find('[data-selecteddatestring]').text().trim();
                            $('#' + $this.attr('aria-describedby')).find('[data-name="mds-datetimepicker-title"]').html(selectedDateString);
                            $('#' + $this.attr('aria-describedby')).find('[data-name="mds-datetimepicker-popoverbody"]').html(calendarHtml);
                            triggerStart = false;
                        }, 10);
                    });
                }
            });
        },
        getText: function () {
            return getSelectedDateTimeText(getSetting2($(this)));
        },
        getDate: function () {
            return getSetting2($(this)).selectedDate;
        },
        getDateRange: function () {
            var setting = getSetting2($(this));
            if (!setting.toDate && !setting.fromDate || !setting.groupId) return [];
            var fromDateSetting = getSetting2($('[' + mdDatePickerGroupIdAttribute + '="' + setting.groupId + '"][data-fromDate]')),
                toDateSetting = getSetting2($('[' + mdDatePickerGroupIdAttribute + '="' + setting.groupId + '"][data-toDate]'));
            return [fromDateSetting.selectedDate, toDateSetting.selectedDate];
        },
        setDate: function (dateTimeObject) {
            if (dateTimeObject == undefined) throw new Error('MdPersianDateTimePicker => setDate => مقدار ورودی نا معتبر است');
            var $this = $(this),
                setting = getSetting2($this);
            setting.selectedDate = getClonedDate(dateTimeObject);
            setSetting2($this, setting);
            setSelectedText(setting);
        },
        setDatePersian: function (dateTimeObjectJson) {
            if (dateTimeObjectJson == undefined) throw new Error('MdPersianDateTimePicker => setDatePersian => ورودی باید از نوه جی سان با حداقل پراپرتی های year, month, day باشد');
            dateTimeObjectJson.hour = !dateTimeObjectJson.hour ? 0 : dateTimeObjectJson.hour;
            dateTimeObjectJson.minute = !dateTimeObjectJson.hour ? 0 : dateTimeObjectJson.minute;
            dateTimeObjectJson.second = !dateTimeObjectJson.second ? 0 : dateTimeObjectJson.second;
            var $this = $(this),
                setting = getSetting2($this);
            setting.selectedDate = getDateTime2(dateTimeObjectJson);
            setSetting2($this, setting);
            setSelectedText(setting);
        },
        hide: function () {
            hidePopover($(this));
        },
        show: function () {
            var $this = $(this),
                setting = getSetting2($this);
            $(this).trigger(setting.trigger);
        },
        disable: function (isDisable) {
            var $this = $(this),
                setting = getSetting2($this);
            setting.disabled = isDisable;
            setSetting2($this, setting);
            if (isDisable) $this.attr('disabled', '');
            else $this.removeAttr('disabled');
        },
        changeType: function (isGregorian, englishNumber) {
            var $this = $(this),
                setting = getSetting2($this);
            hidePopover($this);
            setting.isGregorian = isGregorian;
            setting.englishNumber = englishNumber;
            if (setting.isGregorian) setting.englishNumber = true;
            setSetting2($this, setting);
            setSelectedText(setting);
        }
    };

    $.fn.MdPersianDateTimePicker = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist in jquery.Bootstrap-PersianDateTimePicker');
            return false;
        }
    };

})(jQuery);