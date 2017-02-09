const k = 10;
const w = 210 * k;
const h = 297 * k;

let svg = document.getElementsByTagName('svg')[0];
let s = SVG(svg);

s.viewbox(0, 0, w, h);

let ctx = s.group();

let currentDate = new Date();
let month = Calendario.renderMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
ctx.add(month);
