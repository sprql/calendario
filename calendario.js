'use strict';

window.Calendario = (function() {
    const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'z+'];
    const monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayFullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayShortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const fontFamily = 'Ubuntu';
    const k = 10;

    const w = 210 * k;
    const h = 297 * k;

    const wc = w / 9;
    const baseFontSize = 60 * 2;

    const imageURL = 'image.jpg';

    function getWeek(date) {
        let dayNumber = (date.getDay() + 6) % 7;

        let target = new Date(date.valueOf());
        target.setDate(target.getDate() - dayNumber + 3);

        let firstThursday = target.valueOf();

        target.setMonth(0, 1);
        if (target.getDay() != 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }

        return 1 + Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000));
    }

    function getWeekDay(date) {
        let day = date.getDay();
        return (day == 0) ? 6 : day - 1;
    }

    function dayNameCell(text) {
        let dv = new SVG.G();
        dv.rect(wc, wc);

        let t = dv.text(text)
        t.move(wc / 2, 0);
        t.font({
            family:   fontFamily,
            size:     baseFontSize / 2.75,
            anchor:   'middle',
            leading:  '3em'
        });
        return dv;
    }

    function dayCell(text) {
        let dv = new SVG.G();
        dv.rect(wc, wc);
        if (text) {
            let t = dv.text(text)
            t.move(wc / 2, 0);
            t.font({
                family:   fontFamily,
                size:     baseFontSize,
                anchor:   'middle',
                leading:  '1.4em'
            });
        }
        return dv;
    }

    function sprintIdCell(date) {
        let sprintId = getWeek(date);
        let sprintHalfId = Math.ceil((sprintId/2)) - 1;
        let sprintAlphaId = alpha[sprintHalfId];

        let dv = new SVG.G();
        dv.rect(wc, wc);

        let t = dv.text(sprintId + ' ' + sprintAlphaId);
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

    function renderMonth(year, month, highlightDays) {
        let table = new SVG.G();
        let yk = 0;

        let monthBlock = table.group();
        let daysMatrix = monthBlock.group();
        let g = daysMatrix.group();

        g.attr({ class: 'month-name' });
        g.move(0, yk * wc);
        let t = g.text(monthFullNames[month - 1]);
        t.move(w - 2*wc, 0);
        t.font({
            family:   fontFamily,
            size:     baseFontSize,
            anchor:   'end',
            leading:  '1.5em'
        });

        yk++;

        for (let d = 0; d < 7; d++) {
            let className = 'day day-names' + ((d >= 5) ? ' day-holyday' : '');
            let dv = dayNameCell(dayFullNames[d]);
            dv.attr({ class: className });
            dv.move(wc * d, yk * wc);
            daysMatrix.add(dv);
        }

        let date = new Date(month + '/' + 1 + '/' + year);
        let firstWeekDayOfMonth = getWeekDay(date);

        if (firstWeekDayOfMonth > 0) {
            yk++;
            let sprintCell = sprintIdCell(date);
            sprintCell.move(-wc, wc * yk);
            daysMatrix.add(sprintCell);
        }

        date.setDate(date.getDate() - firstWeekDayOfMonth);
        for (let d = 0; d < firstWeekDayOfMonth; d++) {
            let dv = dayCell(date.getDate().toString());
            dv.attr({ class: 'day of-prev-month' });
            dv.move(d * wc, yk * wc);
            daysMatrix.add(dv);
            date.setDate(date.getDate() + 1);
        }

        for (let d = 1; d < 32; d++) {
            let weekDay = getWeekDay(date);
            if (weekDay == 0) {
                yk++;
                let sprintCell = sprintIdCell(date);
                sprintCell.move(-wc, wc * yk);
                daysMatrix.add(sprintCell);
            }

            let className = 'day';
            if (weekDay > 4) { className += ' day-holyday'; }
            let dv = dayCell(d.toString());
            dv.attr({ class: className });
            dv.move(wc * weekDay, wc * yk);
            daysMatrix.add(dv);

            date.setDate(date.getDate() + 1);
            if ((date.getMonth() + 1) > month) {
                break;
            }
        }

        let lastWeekDayOfMonth = getWeekDay(date);
        if (lastWeekDayOfMonth > 0) {
            for (let d = lastWeekDayOfMonth; d < 7; d++) {
                let className = 'day of-next-month';
                if (d > 4) { className += ' day-holyday'; }
                let dv = dayCell(date.getDate().toString());
                dv.attr({ class: className });
                dv.move(wc * d, wc * yk);
                daysMatrix.add(dv);
                date.setDate(date.getDate() + 1);
            }
        }

        let tableHeight = (yk + 1.5) * wc;
        daysMatrix.move(wc, h - tableHeight);

        let image = table.image(imageURL, w, h - tableHeight);
        image.move(0, 0);
        image.attr({ preserveAspectRatio: 'xMaxYMid slice' });

        return table;
    }

    return {
        renderMonth: renderMonth
    };
})();