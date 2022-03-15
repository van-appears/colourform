const render = require("./render");

window.onload = function () {
  const qs = s => document.querySelector(s);
  const renderArea = qs(".render");
  let colourMode = qs("#colourMode").checked
    ? "hsv"
    : "rgb";
  qs("#model").className = colourMode;

  function getCleanedFn(field) {
    const value = qs("[name=" + field + "]").value;
    return value.replace(/\n/g, "").trim();
  }

  function getScale(field) {
    return qs("[name=" + field + "Scale]:checked").value;
  }

  function getLimit(field) {
    return qs("[name=" + field + "Limit]:checked").value;
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
    return qs("[name=colour]").checked ? "rgb" : "hsv";
  }

  function getImageSize() {
    return qs("[name=imageSize]").checked ? "big" : "small";
  }

  function setGenerated(flag) {
    qs("body").className = flag ? "generated" : "";
  }

  function setEnabled(field, disabled) {
    const fields = document.querySelectorAll("[name=" + field + "]");
    for (let index = 0; index < fields.length; index++) {
      fields[index].disabled = disabled;
    }
  }

  function updateColourLabels() {
    if (colourMode === "hsv") {
      qs("label[for=first]").innerHTML = 'Hue';
      qs("label[for=first]").title = 'Hue formula (0 - 360)';
      qs("label[for=second]").innerHTML = 'Saturation';
      qs("label[for=second]").title = 'Saturation formula (0 - 100)';
      qs("label[for=third]").innerHTML = 'Value';
      qs("label[for=third]").title = 'Value formula (0 - 100)';
    } else {
      qs("label[for=first]").innerHTML = 'Red';
      qs("label[for=first]").title = 'Red formula (0 - 255)';
      qs("label[for=second]").innerHTML = 'Green';
      qs("label[for=second]").title = 'Green formula (0 - 255)';
      qs("label[for=third]").innerHTML = 'Blue';
      qs("label[for=third]").title = 'Blue formula (0 - 255)';
    }
  }

  function runRender() {
    render(
      opt("first"),
      opt("second"),
      opt("third"),
      colourMode,
      getImageSize(),
      img => {
        img.onclick = () => setGenerated(false);
        renderArea.appendChild(img);
        qs("#run").disabled = false;
      }
    );
  }

  setEnabled("firstLimit", qs("#firstMinMax").checked);
  setEnabled("secondLimit", qs("#secondMinMax").checked);
  setEnabled("thirdLimit", qs("#thirdMinMax").checked);

  qs("#run").onclick = function () {
    setGenerated(true);
    qs("#run").disabled = true;
    if (renderArea.firstChild) {
      renderArea.removeChild(renderArea.firstChild);
    }
    // arbitrary timeout to let the UI update
    setTimeout(runRender, 100);
  };

  qs("#colourMode").onclick = function (e) {
    colourMode = e.target.checked ? "hsv" : "rgb";
    qs("#model").className = colourMode;
    updateColourLabels();
  };

  qs("#model").onchange = function (e) {
    if (e.target.name === "firstScale") {
      setEnabled("firstLimit", e.target.value === "minMax");
    } else if (e.target.name === "secondScale") {
      setEnabled("secondLimit", e.target.value === "minMax");
    } else if (e.target.name === "thirdScale") {
      setEnabled("thirdLimit", e.target.value === "minMax");
    }
  };

  updateColourLabels();
};
