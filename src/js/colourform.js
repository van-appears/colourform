const render = require("./render");

// no cheating on your formulas!
fetch = null;
XMLHttpRequest = null;

window.onload = function () {
  const qs = s => document.querySelector(s);
  const renderArea = qs(".render");
  let imageSize, colourMode;

  function getCleanedFn(field) {
    let value = qs(`[name=${field}]`).value;
    value = value.replace(/\n/g, "").trim();
    value = value.replace(/;$/, "");
    return value;
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

  function setColourMode() {
    colourMode = qs("#colourMode").checked ? "hsv" : "rgb";
    qs("#model").className = colourMode;
    if (colourMode === "hsv") {
      qs("label[for=colourMode]").title = "Hue, Saturation, Value";
      qs("label[for=first]").innerHTML = "Hue";
      qs("label[for=first]").title = "Hue formula (0 - 360)";
      qs("label[for=second]").innerHTML = "Saturation";
      qs("label[for=second]").title = "Saturation formula (0 - 100)";
      qs("label[for=third]").innerHTML = "Value";
      qs("label[for=third]").title = "Value formula (0 - 100)";
    } else {
      qs("label[for=colourMode]").title = "Red, Green, Blue";
      qs("label[for=first]").innerHTML = "Red";
      qs("label[for=first]").title = "Red formula (0 - 255)";
      qs("label[for=second]").innerHTML = "Green";
      qs("label[for=second]").title = "Green formula (0 - 255)";
      qs("label[for=third]").innerHTML = "Blue";
      qs("label[for=third]").title = "Blue formula (0 - 255)";
    }
  }

  function setImageSize() {
    imageSize = qs("[name=imageSize]").checked ? "big" : "small";
    if (imageSize === "big") {
      qs("label[for=imageSize]").title = "Big (1400 x 1400)";
    } else {
      qs("label[for=imageSize]").title = "Small (512 x 512)";
    }
  }

  function setGenerated(flag) {
    qs("body").className = flag ? "generated" : "";
  }

  function setEnabled(field, disabled) {
    const fields = document.querySelectorAll(`[name=${field}]`);
    for (let index = 0; index < fields.length; index++) {
      fields[index].disabled = disabled;
    }
  }

  function setFailures(failures) {
    ["first", "second", "third"].forEach(f => {
      qs(`#${f}`).className = failures[f] ? "invalid" : "";
      qs(`span[for=${f}].error`).innerHTML = failures[f] || "";
    });
  }

  function runRender() {
    render(
      opt("first"),
      opt("second"),
      opt("third"),
      colourMode,
      imageSize,
      (failures, img) => {
        setFailures(failures || {});
        qs("#run").disabled = false;
        if (failures) {
          setGenerated(false);
        } else {
          img.onclick = () => setGenerated(false);
          renderArea.appendChild(img);
        }
      }
    );
  }

  qs("#run").onclick = function () {
    setGenerated(true);
    qs("#run").disabled = true;
    if (renderArea.firstChild) {
      renderArea.removeChild(renderArea.firstChild);
    }
    // arbitrary timeout to let the UI update
    setTimeout(runRender, 100);
  };

  qs("#shuffle").onclick = function () {
    const positions = ["first", "second", "third"];
    positions
      .map(field => ({
        v: qs(`[name=${field}]`).value,
        r: Math.random()
      }))
      .sort((a, b) => a.r - b.r)
      .forEach(({ v }, i) => {
        qs(`[name=${positions[i]}]`).value = v;
      });
  };

  qs("#colourMode").onclick = function (e) {
    setColourMode(e.target.checked);
  };

  qs("#imageSize").onclick = function (e) {
    setImageSize(e.target.checked);
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

  qs("#model").className = colourMode;
  setEnabled("firstLimit", qs("#firstMinMax").checked);
  setEnabled("secondLimit", qs("#secondMinMax").checked);
  setEnabled("thirdLimit", qs("#thirdMinMax").checked);
  setColourMode();
  setImageSize();
};
