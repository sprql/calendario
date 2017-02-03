var fontFamily = 'Ubuntu';

function $id(id) { return document.getElementById(id); }

Date.prototype.getWeek = function() {
    var dayNumber = (this.getDay() + 6) % 7;

    var target = new Date(this.valueOf());
    target.setDate(target.getDate() - dayNumber + 3);

    var firstThursday = target.valueOf();

    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }

    return 1 + Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000));
}

function HighlightDays(days) {
    this.days = {}
    for (var i in days) {
        this.days[days[i]] = true;
    }
}

function cweek(date) {
    var day = date.getDay();
    day--;
    if (day == -1) { day = 6 }
    return day;
}

function dayCell(ctx, text, className) {
    var cr = 5;
    var dv = ctx.group();
    dv.rect(wc, wc);
    if (text) {
        var t = dv.text(text)
        t.move(wc / 2, 0);
        t.font({
            family:   fontFamily,
            size:     baseFontSize,
            anchor:   'middle',
            leading:  '1.5em'
        });
    }

    dv.circle(cr).move(-cr/2, -cr/2);
    dv.circle(cr).move(wc - cr/2, -cr/2);
    dv.circle(cr).move(-cr/2, wc - cr/2);
    dv.circle(cr).move(wc - cr/2, wc - cr/2);

    dv.attr({ class: className });

    return dv;
}

function sprintIdCell(ctx, date) {
    var sprintId = date.getWeek();
    var sprintHalfId = Math.floor((sprintId/2)) - 1;
    var sprintAlphaId = alpha[sprintHalfId];

    var cr = 5;
    var dv = ctx.group();
    dv.rect(wc, wc);

    var t = dv.text(sprintId + '.' + sprintAlphaId);
    t.move(wc / 2, 0);
    t.font({
        family:   fontFamily,
        size:     baseFontSize * 0.3,
        anchor:   'middle',
        leading:  '4em'
    });

    dv.attr({ class: 'sprint-id' });

    return dv;
}

function renderMonth(ctx, year, month, highlightDays) {
    var monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayFullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var dayShortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    var hlDays = (highlightDays) ? new HighlightDays(highlightDays) : null;

    var f = 6;

    var table = ctx.group();
    var yk = 0;

    var monthBlock = table.group();
    var daysMatrix = monthBlock.group();
    var g = daysMatrix.group();

    g.attr({ class: 'month-name' });
    g.move(0, yk * wc);
    var t = g.text(monthFullNames[month - 1]);
    t.move(w - 2*wc, 0);
    t.font({
        family:   fontFamily,
        size:     baseFontSize,
        anchor:   'end',
        leading:  '1.5em'
    });

    yk++;

    for (var d = 0; d < 7; d++) {
        var className = 'day day-names' + ((d >= 5) ? ' day-holyday' : '');
        var dv = dayCell(daysMatrix, dayFullNames[d], className);
        dv.move(wc * d, yk * wc);
        dv.get(1).font({ size: baseFontSize / 2.75, leading: '3em' });
    }

    yk++;

    var weekDay = cweek(new Date(month + '/01/' + year));

    var date = null;

    for (var d = 0; d < weekDay; d++) {
        var dv = dayCell(daysMatrix, null, 'day of-prev-month');
        dv.move(d * wc, yk * wc);
    }


    for (var d = 1; d < 32; d++) {
        date = new Date(month + '/' + d + '/' + year);
        if ((date.getMonth() + 1) > month) {
            break;
        }

        weekDay = cweek(date);

        var className = 'day';
        if (weekDay > 4) { className += ' day-holyday'; }
        var dv = dayCell(daysMatrix, d.toString(), className);
        dv.move(wc * weekDay, wc * yk);

        if (weekDay == 6) {
            var sprintCell = sprintIdCell(daysMatrix, date);
            sprintCell.move(-wc, wc * yk);
            yk++;
        }
    }

    if ((weekDay + 1) < 7) {
        var sprintCell = sprintIdCell(daysMatrix, date);
        sprintCell.move(-wc, wc * yk);
    }

    for (var d = (weekDay + 1); d < 7; d++) {
        var className = 'day of-next-month';
        if (d > 4) { className += ' day-holyday'; }
        var dv = dayCell(daysMatrix, null, className);
        dv.move(wc * d, wc * yk);
    }

    daysMatrix.move(wc, h - (yk + 2) * wc);
}

var alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var svg = document.getElementsByTagName('svg')[0]

var s = SVG(svg);

var k = 10;

var w = 210 * k;
var h = 297 * k;

var wc = w / 9;
var baseFontSize = 60 * 2;

s.viewbox(0, 0, w, h);

var ctx = s.group();

var image = ctx.image('image.jpg', w, 4 * wc);
image.move(0, wc/2);

var currentDate = new Date();
renderMonth(ctx, currentDate.getFullYear(), currentDate.getMonth() + 1);
