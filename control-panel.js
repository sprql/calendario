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

function renderPreviousMonth() {
    month.remove();
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    month = Calendario.renderMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
    ctx.add(month);
}

function renderNextMonth() {
    month.remove();
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    month = Calendario.renderMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
    ctx.add(month);
}

function changeImage(event) {
    let image = month.node.querySelector('image');
    image.setAttribute('href', event.target.value);
}

let panel = document.querySelector('[data-behavior=control-panel]');
panel.querySelector('[data-action=previous-month]').addEventListener('click', renderPreviousMonth);
panel.querySelector('[data-action=next-month]').addEventListener('click', renderNextMonth);
let imageInput = panel.querySelector('[data-input=image-url]');
imageInput.addEventListener('keyup', changeImage);
imageInput.addEventListener('change', changeImage);
