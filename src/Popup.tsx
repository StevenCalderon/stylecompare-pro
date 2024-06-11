import { useState } from "react";

const Popup = () => {
  const [element1, setElement1] = useState<{ [key: string]: string } | null>(
    null
  );
  const [element2, setElement2] = useState<{ [key: string]: string } | null>(
    null
  );

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (request.action === "setElemetSelected" && request.styles) {
        console.log("Received message: setElemetSelected",request.elementNumber, request);
        if (request.elementNumber === 1) {
          setElement1(request.styles);
        } else {
          setElement2(request.styles);
        }
        
      }
    }
  );

  const selectElement = async (elementNumber: number) => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (elementNumber) => {
            chrome.runtime.sendMessage(
              { action: "selectElement", elementNumber:elementNumber },
              (response) => {
                console.log(
                  "Response from selectElement -- content.js:",
                  response
                );
              }
            );
          },
          args: [elementNumber] // 
        });
      }
      
    
    } catch (error) {
      console.error("Error querying tabs:", error);
    }
  };

  const compareStyles = () => {
    console.log("Elementos seleccionados", element1, element2);
    if (!element1 || !element2) {
      alert("Please select both elements first.");
      return;
    }

    const differences: string[] = [];
    for (let style in element1) {
      if (element1[style] !== element2[style]) {
        differences.push(`${style}: ${element1[style]} != ${element2[style]}`);
      }
    }

    alert(
      differences.length > 0 ? differences.join("\n") : "No differences found."
    );
  };

  return (
    <div>
      <button onClick={async () => await selectElement(1)}>Select Element 1</button>
      <button onClick={async () => await selectElement(2)}>Select Element 2</button>
      <button onClick={compareStyles}>Compare Styles</button>
    </div>
  );
};

export default Popup;
