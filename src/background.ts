// Arrays to store component IDs
const capturedComponentIds: string[] = [];

// Background script for capturing network requests
chrome.webRequest.onBeforeRequest.addListener(
  (details: chrome.webRequest.WebRequestBodyDetails) => {
    const url = new URL(details.url);

    // Extract the 'opname' parameter from the query string
    const opname = url.searchParams.get('opname');

    // Check if 'opname' is equal to 'renderCustomComponent'
    if (opname === 'renderCustomComponent') {
      let componentId: string | null = null;

      if (details.requestBody) {
        // Check if the request contains raw data
        if (details.requestBody.raw && details.requestBody.raw.length > 0) {
          try {
            // Decode the raw payload to a string
            const rawPayload = new TextDecoder().decode(new Uint8Array(details.requestBody.raw[0].bytes ?? []));

            // Parse the raw payload as JSON to extract the variables
            const parsedPayload = JSON.parse(rawPayload);

            // Extract the componentId from variables, if available
            if (parsedPayload.variables && parsedPayload.variables.componentId) {
              componentId = parsedPayload.variables.componentId;
              console.log("Extracted componentId from variables:", componentId);
            }
          } catch (e) {
            console.error('Error parsing raw payload as JSON:', e);
          }
        } else {
          console.log("Request body is empty or unsupported format.");
        }
      } else {
        console.log("No requestBody found in details.");
      }

      // Store the componentId if found
      if (componentId) {
        console.log("Captured componentId:", componentId);
        capturedComponentIds.push(componentId);
      } else {
        console.log("No componentId found in the request payload.");
      }
    }
  },
  { urls: ["<all_urls>"], types: ["xmlhttprequest", "other"] }, // Intercept both 'XHR' and 'fetch' requests
  ["requestBody"]
);

// Listener for popup requests
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "getCapturedRequests") {
    // Send the stored component IDs to the popup
    sendResponse({ componentIds: capturedComponentIds });
  }
});
