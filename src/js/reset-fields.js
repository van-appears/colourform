module.exports = function resetFields() {
  document.querySelector("#colourMode").checked = false;
  return {
    colourModel: "rgb"
  };
};
