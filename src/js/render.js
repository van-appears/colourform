const size = 1400;
const pi2 = 2 * Math.PI;
const convert = require("color-convert");
const canvas = document.querySelector("#draw");
const renderArea = document.querySelector(".render");
const context = canvas.getContext("2d");
const canvasData = context.getImageData(0, 0, size, size);

function drawPixel(x, y, r, g, b) {
  const index = (x + y * size) * 4;
  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = 255;
}

function buildImage() {
  context.putImageData(canvasData, 0, 0);
  const img = new Image();
  img.src = canvas.toDataURL();
  if (renderArea.firstChild) {
    renderArea.removeChild(renderArea.firstChild);
  }
  renderArea.appendChild(img);
}

function asFn(str) {
  return new Function(
    "x",
    "y",
    "xr",
    "yr",
    "l",
    "pi2",
    `
try {
  return (${str});
} catch (e) {
  return 0;
}`
  );
}

function limit(val, max) {
  return Math.min(Math.max(0, val), max);
}

function wrap(val, max) {
  if (val < 0) {
    while (val < 0) {
      val += max;
    }
  } else if (val > max) {
    while (val > max) {
      val -= max;
    }
  }
  return val;
}

function reflect(val, max) {
  while (val < 0 || val > max) {
    if (val < 0) {
      val = -val;
    } else {
      val = 2 * max - val;
    }
  }
  return val;
}

function asLimit(limitOpt) {
  if (limitOpt === "wrap") {
    return (val, max) => limit(wrap(val, max), max);
  }
  if (limitOpt === "reflect") {
    return (val, max) => limit(reflect(val, max), max);
  }
  return limit;
}

function asScale(scaleOpt) {
  if (scaleOpt === "minusPlusOne") {
    return (val, max) => ((val + 1) * max) / 2;
  }
  return val => val;
}

function render(firstOpt, secondOpt, thirdOpt, colourMode) {
  let firstFn, secondFn, thirdFn;
  let firstScale, secondScal, thirdScale;
  let firstLimit, secondLimit, thirdLimit;
  let failures = [];

  try {
    firstFn = asFn(firstOpt.fn);
    firstScale = asScale(firstOpt.scale);
    firstLimit = asLimit(firstOpt.limit);
  } catch (e) {
    failures.push(firstOpt.field);
  }

  try {
    secondFn = asFn(secondOpt.fn);
    secondScale = asScale(secondOpt.scale);
    secondLimit = asLimit(secondOpt.limit);
  } catch (e) {
    failures.push(secondOpt.field);
  }

  try {
    thirdFn = asFn(thirdOpt.fn);
    thirdScale = asScale(thirdOpt.scale);
    thirdLimit = asLimit(thirdOpt.limit);
  } catch (e) {
    failures.push(thirdOpt.field);
  }

  if (failures.length) {
    return failures;
  }

  const values = new Array(size);
  for (let x = 0; x < size; x++) {
    values[x] = new Array(size);
    for (let y = 0; y < size; y++) {
      const xr = x / (size - 1);
      const yr = y / (size - 1);
      values[x][y] = [
        firstFn(x, y, xr, yr, size, pi2),
        secondFn(x, y, xr, yr, size, pi2),
        thirdFn(x, y, xr, yr, size, pi2)
      ];
    }
  }

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let [first, second, third] = values[x][y];
      first = firstLimit(firstScale(first, 360), 360);
      second = secondLimit(secondScale(second, 100), 100);
      third = thirdLimit(thirdScale(third, 100), 100);
      const [r, g, b] = convert.hsv.rgb.raw(first, second, third);
      drawPixel(x, y, r, g, b);
    }
  }

  buildImage();
}

module.exports = render;
