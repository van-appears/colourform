const render = require("./render");

module.exports = function connectListeners(model) {
  let colourMode = "rgb";

  function getCleanedFn(field) {
    const value = document.querySelector("[name=" + field + "]").value;
    return value.replace(/\n/g, "").trim();
  }

  function getScale(field) {
    return document.querySelector("[name=" + field + "Scale]:checked").value;
  }

  function getLimit(field) {
    return document.querySelector("[name=" + field + "Limit]:checked").value;
  }

  function opt(field) {
    return {
      field,
      fn: getCleanedFn(field),
      scale: getScale(field),
      limit: getLimit(field)
    };
  }

  function getColourMode() {
    return document.querySelector("[name=colour]").checked ? "rgb" : "hsv";
  }

  document.querySelector("#run").onclick = function () {
    render(opt("first"), opt("second"), opt("third"), colourMode);
  };

  document.querySelector("#colourMode").onclick = function (e) {
    colourMode = e.target.checked ? "hsv" : "rgb";
    document.querySelector("#model").className = colourMode;
  };
};
