
[![Build Status](https://api.travis-ci.org/azerafati/az.BootstrapPersianDateTimePicker.svg?branch=master)](https://travis-ci.org/azerafati/az.BootstrapPersianDateTimePicker)
[![npm version](https://img.shields.io/npm/v/az.bootstrappersiandatetimepicker.svg)](https://www.npmjs.com/package/az.bootstrappersiandatetimepicker)
[![Issues](https://img.shields.io/github/issues/azerafati/az.BootstrapPersianDateTimePicker.svg)](https://github.com/azerafati/az.BootstrapPersianDateTimePicker/issues)
[![Dependencies Status](https://img.shields.io/david/azerafati/az.BootstrapPersianDateTimePicker.svg)](https://david-dm.org/azerafati/az.BootstrapPersianDateTimePicker?type=peer)
[![devDependency Status](https://img.shields.io/david/dev/azerafati/az.BootstrapPersianDateTimePicker.svg)](https://david-dm.org/azerafati/az.BootstrapPersianDateTimePicker?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/azerafati/az.BootstrapPersianDateTimePicker/badge.svg?branch=master-bs4)](https://coveralls.io/github/azerafati/az.BootstrapPersianDateTimePicker?branch=master-bs4)
[![CSS gzip size](https://img.badgesize.io/azerafati/az.BootstrapPersianDateTimePicker/master-bs4/dist/az.bootstrappersiandatetimepicker.css?compression=gzip&label=CSS+gzip+size)](https://github.com/azerafati/az.BootstrapPersianDateTimePicker/master-bs4/dist/az.bootstrappersiandatetimepicker.css)
[![JS gzip size](https://img.badgesize.io/azerafati/az.BootstrapPersianDateTimePicker/master-bs4/dist/az.bootstrappersiandatetimepicker.js?compression=gzip&label=JS+gzip+size)](https://github.com/azerafati/az.BootstrapPersianDateTimePicker/master-bs4/dist/az.bootstrappersiandatetimepicker.js)
[![License](https://img.shields.io/github/license/azerafati/az.BootstrapPersianDateTimePicker.svg)](#license)




# az.BootstrapPersianDateTimePicker
#### Bootstrap 4+ Persian And Gregorian Date Time Picker jQuery 3+ Plugin + AngularJS Wrapper

[CHECK OUT THE DEMO HERE](https://github.azerafati.com/az.BootstrapPersianDateTimePicker/)


Using bootstrap's [Popovers](https://getbootstrap.com/docs/4.3/components/popovers/), `az.BootstrapPersianDateTimePicker` is very flexible and powerful.
<hr>

## Dependencies:

 - [`jQuery`](https://jquery.com/)
 - [`Bootstrap 4+`](https://getbootstrap.com/)
 - [`MomentJS`](https://momentjs.com/)
 - [`moment-jalaali`](https://github.com/jalaali/moment-jalaali)

## Install

```shell
npm install az.bootstrappersiandatetimepicker
```

Now add these to your html:
```html
<link href="/dist/az.bootstrappersiandatetimepicker.css" rel="stylesheet"/>
<script src="/dist/az.bootstrappersiandatetimepicker.js"></script>
```
### API:
```javascript
$('#id').azPersianDateTimePicker({ 
  targetTextSelector: $('#inputTextDate1'),
  targetDateSelector: $('#inputHiddenDate1'),
});
```

<hr>

#### Options:
Default values are indicated using `[ ]`

Name | Values | Description | Sample
------------- | ------------- | ------------- |-------------
**englishNumber** | [false], true | Switch between English number or Persian number 
**placement** | top, right, [bottom], left | Position of date time picker 
**trigger** | [click], mousedown, focus, ... | Event to show date time picker 
**enableTimePicker** | [false], true | Time picker visibility 
**targetTextSelector** | String | CSS selector to show selected date as `format` property into it | '#TextBoxId'
**targetDateSelector** | String | CSS selector to save selected date into it | '#InputHiddenId'
**toDate** | [false], true | When you want to set date picker as `toDate` to enable date range selecting 
**fromDate** | [false], true | When you want to set date picker as `fromDate` to enable date range selecting
**groupId** | String | When you want to use `toDate`, `fromDate` you have to enter a group id to specify date time pickers| 'dateRangeSelector1'
**disabled** | [false], true | Disable date time picker 
**textFormat** | String | format of selected date to show into `targetTextSelector` | 'yyyy/MM/dd HH:mm:ss'
**dateFormat** | String | format of selected date to save into `targetDateSelector` | 'yyyy/MM/dd HH:mm:ss'
**isGregorian** | [false], true | Is calendar Gregorian 
**inLine** | [false], true | Is date time picker in line 
**selectedDate** | [undefined], new Date() | Selected date as JavaScript Date object | new Date('2018/9/30')
**monthsToShow** | Numeric array with 2 items, [0 ,0] | To show, number of month before and after selected date in date time picker, first item is for before month, second item is for after month | [1, 1]
**yearOffset** | Number | Number of years to select in year selector | 30
**holiDays** | Array: Date[] | Array of holidays to show in date time picker as holiday | [new Date(), new Date(2017, 3, 2)]
**disabledDates** | Array: Date[] | Array of disabled dates to prevent user to select them | [new Date(2017, 1, 1), new Date(2017, 1, 2)] 
**disableBeforeToday** | [false], true | Disable days before today 
**disableAfterToday** | [false], true | Disable days after today 
**disableBeforeDate** | Date | Disable days before this Date | new Date(2018, 11, 12) 
**disableAfterDate** | Date | Disable days after this Date | new Date(2018, 12, 11) 
**rangeSelector** | [false], true | Enables rangeSelector feature on date time picker

<hr>

### String format:

Format | English Description | Persian Description 
------------- | ------------- | -------------
**yyyy** | Year, 4 digits | سال چهار رقمی
**yy** | Year, 2 digits | سال دو رقمی
**MMMM** | Month name | نام ماه
**MM** | Month, 2 digits | عدد دو رقمی ماه
**M** | Month, 1 digit | عدد تک رقمی ماه
**dddd** | Week day name | نام روز هفته
**dd** | Month's day, 2 digits | عدد دو رقمی روز 
**d** | Month's day, 1 digit | عدد تک رقمی روز 
**HH** | Hour, 2 digits - 0 - 24 | عدد دو رقمی ساعت با فرمت 0 تا 24
**H** | Hour, 1 digit - 0 - 24 | عدد تک رقمی ساعت با فرمت 0 تا 24
**hh** | Hour, 2 digits - 0 - 12 | عدد دو رقمی ساعت با فرمت 0 تا 12
**h** | Hour, 1 digit - 0 - 12 | عدد تک رقمی ساعت با فرمت 0 تا 12
**mm** | Minute, 2 digits | عدد دو رقمی دقیقه
**m** | Minute, 1 digit | عدد تک رقمی دقیقه
**ss** | Second, 2 digits | ثانیه دو رقمی
**s** | Second, 1 digit | ثانیه تک رقمی
**tt** | AM / PM | ب.ظ یا ق.ظ
**t** | A / P | حرف اول از ب.ظ یا ق.ظ

<hr>

### Functions:

Name | Return | Description | Sample
------------- | ------------- | ------------- |-------------
**getText** | string | Get selected date text | $('#id').MdPersianDateTimePicker('getText');
**getDate** | Date | Get selected date | $('#id').MdPersianDateTimePicker('getDate');
**getDateRange** | [fromDate, toDate]: Date[] | Get selected date range | $('#id').MdPersianDateTimePicker('getDateRange');
**setDate** | void | Set selected datetime with Date object argument | $('#id').MdPersianDateTimePicker('setDate', new Date(2018, 11, 12));
**setDateRange** | void | Set selected datetime range with Date object argument | $('#id').MdPersianDateTimePicker('setDateRange', new Date(2018, 11, 01), new Date(2018, 11, 12));
**clearDate** | void | clear selected date | $('#id').MdPersianDateTimePicker('clearDate');
**setDatePersian** | void | Set selected datetime with persian json argument | $('#id').MdPersianDateTimePicker('setDatePersian', {year: 1397, month: 1, day: 1, hour: 0, minute: 0, second: 0});
**hide** | void | Hide date time picker | $('#id').MdPersianDateTimePicker('hide');
**show** | void | Show date time picker | $('#id').MdPersianDateTimePicker('show');
**disable** | void | Disable or enable date time picker | $('#id').MdPersianDateTimePicker('disable', /*isDisable*/ true);
**changeType** | void | Switch between Persian or Gregorian calendar | $('#id').MdPersianDateTimePicker('changeType', /*isGregorian*/ true, /* englishNumber */ true);
**setOption** | void | Set an option | $('#id').MdPersianDateTimePicker('setOption', 'yearOffset', 5);

<hr>

### Events:

`MD.BootstrapPersianDateTimePicker` uses Bootstrap's popover, so you can use `popover` events.

Event Type | Description
------------- | -------------
**show.bs.popover** | This event fires immediately when the show instance method is called.
**shown.bs.popover** | This event is fired when the popover has been made visible to the user (will wait for CSS transitions to complete).
**hide.bs.popover** | This event is fired immediately when the hide instance method has been called.
**hidden.bs.popover** | This event is fired when the popover has finished being hidden from the user (will wait for CSS transitions to complete).
**inserted.bs.popover** | This event is fired after the show.bs.popover event when the popover template has been added to the DOM.

```javascript
$('#date1').on('hidden.bs.popover', function () {
  // do something…
})
```
---
Originally forked from 
[MD.BootstrapPersianDateTimePicker](https://github.com/Mds92/MD.BootstrapPersianDateTimePicker) with the intention of leaving Jalaali date conversion to it's respected libraries and adding AngularJS wrapper for it plus some minor performance and appearance tweaks. 
