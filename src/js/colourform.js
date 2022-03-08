const resetFields = require("./reset-fields");
const connectListeners = require("./connect-listeners");

window.onload = function () {
  const model = resetFields();
  connectListeners(model);
};
