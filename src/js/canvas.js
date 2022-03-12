module.exports = function (size) {
  const body = document.querySelector("body");
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  body.appendChild(canvas);

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
    body.removeChild(canvas);
    return img;
  }

  return {
    drawPixel,
    buildImage
  };
};
