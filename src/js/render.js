const canvas = require("./canvas");
const convert = require("color-convert");
const pi2 = 2 * Math.PI;
const sizes = {
  big: 1400,
  small: 512
};
const limits = {
  hsv: [360, 100, 100],
  rgb: [255, 255, 255]
};

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
    return (val, max) => ((val + 1) / 2) * max;
  }
  if (scaleOpt === "zeroOne") {
    return (val, max) => val * max;
  }
  if (scaleOpt === "minMax") {
    return (val, max, low, high) => (max * (val - low)) / (high - low || 1);
  }
  return val => val;
}

function setNewImage(img, imgClick) {
  const renderArea = document.querySelector(".render");
  img.onclick = imgClick;
  if (renderArea.firstChild) {
    renderArea.removeChild(renderArea.firstChild);
  }
  renderArea.appendChild(img);
}

function render(firstOpt, secondOpt, thirdOpt, colourMode, imgSize, imgClick) {
  let firstFn, secondFn, thirdFn;
  let firstScale, secondScal, thirdScale;
  let firstLimit, secondLimit, thirdLimit;
  let failures = [];
  const size = sizes[imgSize];
  const imgCanvas = canvas(size);

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
  let firstMin = Infinity;
  let firstMax = -Infinity;
  let secondMin = Infinity;
  let secondMax = -Infinity;
  let thirdMin = Infinity;
  let thirdMax = -Infinity;

  for (let x = 0; x < size; x++) {
    values[x] = new Array(size);
    for (let y = 0; y < size; y++) {
      const xr = x / (size - 1);
      const yr = y / (size - 1);
      const first = firstFn(x, y, xr, yr, size, pi2);
      const second = secondFn(x, y, xr, yr, size, pi2);
      const third = thirdFn(x, y, xr, yr, size, pi2);

      values[x][y] = [first, second, third];
      firstMin = Math.min(first, firstMin);
      firstMax = Math.max(first, firstMax);
      secondMin = Math.min(second, secondMin);
      secondMax = Math.max(second, secondMax);
      thirdMin = Math.min(third, thirdMin);
      thirdMax = Math.max(third, thirdMax);
    }
  }

  let [l1, l2, l3] = limits[colourMode];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let [first, second, third] = values[x][y];
      first = firstLimit(firstScale(first, l1, firstMin, firstMax), l1);
      second = secondLimit(secondScale(second, l2, secondMin, secondMax), l2);
      third = thirdLimit(thirdScale(third, l3, thirdMin, thirdMax), l3);

      const [r, g, b] =
        colourMode === "hsv"
          ? convert.hsv.rgb.raw(first, second, third)
          : [first, second, third];
      imgCanvas.drawPixel(x, y, r, g, b);
    }
  }

  const img = imgCanvas.buildImage();
  setNewImage(img, imgClick);
}

module.exports = render;
