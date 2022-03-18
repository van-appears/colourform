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
    "pi2",
    `
try {
  return (${str});
} catch (e) {
  return 0;
}`
  );
}

function testFn(str) {
  const fn = new Function("x", "y", "pi2", `return (${str})`);
  fn(0, 0, pi2);
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
    return (val, max, low, high) => (max * (val - low)) / (high - low);
  }
  return val => val;
}

function render(firstOpt, secondOpt, thirdOpt, colourMode, imgSize, callback) {
  let firstFn, secondFn, thirdFn;
  let firstScale, secondScal, thirdScale;
  let firstLimit, secondLimit, thirdLimit;
  let failures = null;
  const size = sizes[imgSize];
  const imgCanvas = canvas(size);

  try {
    testFn(firstOpt.fn);
    firstFn = asFn(firstOpt.fn);
    firstScale = asScale(firstOpt.scale);
    firstLimit = asLimit(firstOpt.limit);
  } catch (e) {
    console.error(e);
    failures = { [firstOpt.field]: e };
  }

  try {
    testFn(secondOpt.fn);
    secondFn = asFn(secondOpt.fn);
    secondScale = asScale(secondOpt.scale);
    secondLimit = asLimit(secondOpt.limit);
  } catch (e) {
    console.error(e);
    failures = { [secondOpt.field]: e, ...failures };
  }

  try {
    testFn(thirdOpt.fn);
    thirdFn = asFn(thirdOpt.fn);
    thirdScale = asScale(thirdOpt.scale);
    thirdLimit = asLimit(thirdOpt.limit);
  } catch (e) {
    console.error(e);
    failures = { [thirdOpt.field]: e, ...failures };
  }

  if (failures) {
    callback(failures);
    return;
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
      const first = firstFn(xr, yr, pi2);
      const second = secondFn(xr, yr, pi2);
      const third = thirdFn(xr, yr, pi2);

      values[x][y] = [first, second, third];
      firstMin = Math.min(first, firstMin);
      firstMax = Math.max(first, firstMax);
      secondMin = Math.min(second, secondMin);
      secondMax = Math.max(second, secondMax);
      thirdMin = Math.min(third, thirdMin);
      thirdMax = Math.max(third, thirdMax);
    }
  }

  if (firstMin === firstMax) {
    firstMin = 0;
  }
  if (secondMin === secondMax) {
    secondMin = 0;
  }
  if (thirdMin === thirdMax) {
    thirdMin = 0;
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

  callback(null, imgCanvas.buildImage());
}

module.exports = render;
