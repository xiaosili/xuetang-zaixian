document.dispatchEvent(new CustomEvent("busy", { detail: true }));

fetch(url)
  .then(handleNetworkResponse)
  .catch(handleNetworkError)
  .finally(() => {
    document.dispatchEvent("busy", { detail: false });
  });

document.addEventListener("busy", (e) => {
  if (e.detail) {
    showSpinner();
  } else {
    hideSpinner();
  }
});
