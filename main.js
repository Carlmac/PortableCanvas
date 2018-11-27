let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let lineWidth = 5;
let lastCoords = {
  x: 0,
  y: 0
}
let brushActive = false;
let eraserActive = false;

let actionsElem = document.getElementsByClassName('actions')[0];
let brushBtn = document.getElementById('brush');
let eraserBtn = document.getElementById('eraser');
let clearBtn = document.getElementById('clear');
let saveBtn = document.getElementById('save');
let colorSelector = document.getElementById('color-selector');

let isMobileDevice = false;
let eventType = {
  'start': 'mousedown',
  'move': 'mousemove',
  'end': 'mouseup'
}
if (document.body.ontouchstart !== undefined) {
  isMobileDevice = true;
  eventType.start = 'touchstart';
  eventType.move = 'touchmove';
  eventType.end = 'touchend';
}

document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });

function initCanvasSize() {

  resetCanvasSize();

  window.addEventListener('resize', resetCanvasSize);

  function resetCanvasSize() {
    let pageWidth = document.documentElement.clientWidth;
    let pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
  }
}

function draw(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

brushBtn.addEventListener('click', function(event) {
  eraserActive = false;
  eraserBtn.classList.remove('active');
  this.classList.add('active');
});

eraserBtn.addEventListener('click', function(event) {
  eraserActive = true;
  brushBtn.classList.remove('active');
  this.classList.add('active');
});

clearBtn.addEventListener('click', function(event) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener('click', function(event) {
  let url = canvas.toDataURL("image/png");
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = '我的画作';
  a.target = '_blank';
  a.click();
});

colorSelector.addEventListener('click', function(event) {
  let elemSelected = event.target;
  let color = elemSelected.id;
  for (let i = 0; i < this.children.length; i++) {
    this.children[i].classList.remove('active');
  }
  elemSelected.classList.add('active');
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
});

canvas.addEventListener(eventType.start, function(event) {
  let x = isMobileDevice ? event.touches[0].clientX : event.clientX;
  let y = isMobileDevice ? event.touches[0].clientY : event.clientY;
  brushActive = true;

  if (eraserActive) {
    ctx.clearRect(x - 10, y - 10, 20, 20);
  } else {
    lastCoords.x = x;
    lastCoords.y = y;
  }
});

canvas.addEventListener(eventType.move, function(event) {
  if (!brushActive) {
    return;
  }

  let x, y;

  if (isMobileDevice) {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
  } else {
    x = event.clientX;
    y = event.clientY;
  }

  if (eraserActive) {
    ctx.clearRect(x - 10, y - 10, 20, 20);
  } else {
    let currentCoords = {
      'x': x,
      'y': y
    };
    draw(lastCoords.x, lastCoords.y, currentCoords.x, currentCoords.y);
    lastCoords = currentCoords;
  }
});

canvas.addEventListener(eventType.end, function(event) {
  brushActive = false;
});

initCanvasSize();