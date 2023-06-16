const form = document.getElementById("generateForm");
const resultImage = document.getElementById("resultImage");
const downloadButton = document.getElementById("downloadButton");
const loader = document.getElementById("loader");
const submitButton = document.getElementById("submitButton");
const suspend = document.getElementById("suspend");

let _formData = new FormData(form);

const select = document.querySelector("select[name='style']");
const spans = document.querySelectorAll(".styleCard span");
select.addEventListener("change", () => {
  for (let i = 0; i < spans.length; i++) {
    if (spans[i].dataset.value === select.value) {
      spans[i].style.color = "white";
      spans[i].style.fontWeight = "bold";
      spans[i].parentElement.style.border = "2px solid rgba(var(--accent-color), 0.5)";
    } else {
      spans[i].style.color = "rgba(255, 255, 255, 0.65)";
      spans[i].style.fontWeight = "normal";
      spans[i].parentElement.style.border = "2px solid transparent";
    }
  }

  const selected = document.querySelector(
    `.styleCard[data-value='${select.value}']`
  );
  selected.scrollIntoView({ behavior: "smooth", block: "center" });
});

function handleSelection(element) {
  const value = element.dataset.value;
  select.value = value;
  select.dispatchEvent(new Event("change"));
}

function handleHideForm() {
  const form = document.getElementById("generateForm");
  const hideButton = document.getElementById("hideButton");
  const hideButtonIcon = document.getElementById("hideButtonIcon");

  form.classList.toggle("hidden");
  if (form.classList.contains("hidden")) {
    hideButtonIcon.style.transform = "rotate(90deg)";
  } else {
    hideButtonIcon.style.transform = "rotate(0deg)";
  }
}

// if resultimage src is not empty, show download button
resultImage.addEventListener("load", () => {
  if (resultImage.src !== "") {
    downloadButton.style.display = "block";
  }
});
// Load and apply saved parameters from localStorage
const savedParams = JSON.parse(localStorage.getItem("imagineParams"));
if (savedParams) {
  for (let key in savedParams) {
    const input = form[key];
    if (input) {
      if (input.type === "checkbox") input.checked = savedParams[key];
      else input.value = savedParams[key];
      input.dispatchEvent(new Event("change"));
      form.dispatchEvent(new Event("input"));
    }
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  downloadButton.style.display = "none";
  // disable button, change its text to "Generating..."

  submitButton.disabled = true;
  submitButton.innerText = "Generating...";
  submitButton.style.cursor = "default";

  resultImage.style.filter = "blur(20px)";
  resultImage.style.opacity = 0;
  suspend.style.opacity = 0;

  loader.style.opacity = 0.1;

  function dismiss() {
    submitButton.disabled = false;
    submitButton.innerText = "Generate";
    submitButton.style.cursor = "pointer";
    resultImage.style.opacity = 1;
    resultImage.style.filter = "blur(0px)";
    loader.style.opacity = 0;
  }

  const formData = new FormData(form);

  // Save parameters to localStorage
  const paramsToSave = {};
  for (const key of formData.keys()) {
    const input = form[key];
    paramsToSave[key] =
      input.type === "checkbox" ? input.checked : input.value;
  }
  localStorage.setItem("imagineParams", JSON.stringify(paramsToSave));

  const response = await fetch("/", {
    method: "POST",
    body: formData,
  });
  _formData = formData;

  if (response.ok) {
    const result = await response.json().finally(() => {
      dismiss();
    });

    resultImage.src = `data:image/png;base64,${result.img_data}`;
  } else {
    alert("An error occurred while generating the image.");
    dismiss();
  }
});

downloadButton.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = resultImage.src;
  const filename = `imagine_${Date.now()}_${_formData
    .get("prompt")
    .slice(0, 15)}_${_formData.get("style")}_${_formData.get("cfg")}.png`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

function updateTooltipLeftDistance() {
  const form = document.getElementById("generateForm");
  const formRect = form.getBoundingClientRect();
  const tooltipLeftDistance = formRect.left + 300;

  const style = document.createElement("style");
  style.innerHTML = `
    [data-tooltip]::before {
      left: ${tooltipLeftDistance}px;
    }
  `;
  document.head.appendChild(style);
}
window.addEventListener("resize", updateTooltipLeftDistance);
window.addEventListener("load", updateTooltipLeftDistance);
