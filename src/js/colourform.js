const render = require("./render");

window.onload = function () {
  let colourMode = document.querySelector("#colourMode").checked
    ? "hsv"
    : "rgb";

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

  function getImageSize() {
    return document.querySelector("[name=imageSize]").checked ? "big" : "small";
  }

  function setGenerated(flag) {
    document.querySelector("body").className = flag ? "generated" : "";
  }

  function setEnabled(field, disabled) {
    const fields = document.querySelectorAll("[name=" + field + "]");
    for (let index = 0; index < fields.length; index++) {
      fields[index].disabled = disabled;
    }
  }

  setEnabled("firstLimit", document.querySelector("#firstMinMax").checked);
  setEnabled("secondLimit", document.querySelector("#secondMinMax").checked);
  setEnabled("thirdLimit", document.querySelector("#thirdMinMax").checked);

  document.querySelector("#run").onclick = function () {
    setGenerated(true);
    render(
      opt("first"),
      opt("second"),
      opt("third"),
      colourMode,
      getImageSize(),
      () => setGenerated(false)
    );
  };

  document.querySelector("#colourMode").onclick = function (e) {
    colourMode = e.target.checked ? "hsv" : "rgb";
    document.querySelector("#model").className = colourMode;
  };

  document.querySelector("#model").onchange = function (e) {
    if (e.target.name === "firstScale") {
      setEnabled("firstLimit", e.target.value === "minMax");
    } else if (e.target.name === "secondScale") {
      setEnabled("secondLimit", e.target.value === "minMax");
    } else if (e.target.name === "thirdScale") {
      setEnabled("thirdLimit", e.target.value === "minMax");
    }
  };
};
