// contentScript.js
export {};
function addElementSelector() {
  // Create a highlighter div
  const highlighter = document.createElement("div");
  highlighter.style.position = "absolute";
  highlighter.style.border = "2px dashed red";
  highlighter.style.pointerEvents = "none";
  highlighter.style.zIndex = "10000";
  document.body.appendChild(highlighter);

  function onMouseMove(event: { target: any }) {
    const target = event.target;
    const rect = target.getBoundingClientRect();
    highlighter.style.width = rect.width + "px";
    highlighter.style.height = rect.height + "px";
    highlighter.style.top = rect.top + "px";
    highlighter.style.left = rect.left + "px";
  }

  function onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("click", onClick, true);
    document.body.removeChild(highlighter);

    const target = event.target as Element;
    const styles = window.getComputedStyle(target);
    const stylesObj: { [key: string]: string } = {};
    for (const element of styles) {
      stylesObj[element] = styles.getPropertyValue(element);
    }

    chrome.runtime.sendMessage({
      action: "elementSelected",
      styles: stylesObj,
    });
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("click", onClick, true);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request:', request);
  if (request.action === "selectElement") {
    addElementSelector();
  }
});
