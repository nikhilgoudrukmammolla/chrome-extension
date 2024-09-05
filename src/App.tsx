import React, { useState } from 'react';
import './App.css';

const RequestNameViewer: React.FC = () => {
  const [componentIds, setComponentIds] = useState<string[]>([]);

  // Function to fetch captured component IDs from the background script
  const fetchCapturedComponentIds = () => {
    chrome.runtime.sendMessage({ action: "getCapturedRequests" }, (response) => {
      if (response && response.componentIds) {
        setComponentIds(response.componentIds);
      }
    });
  };

  return (
    <div>

      <h2>Components with 'renderCustomComponent'</h2>
      <button className="button" onClick={fetchCapturedComponentIds}>Show</button>
      <ul className='component'>
        {componentIds.map((id, index) => (
          <li key={index}>{id}</li>
        ))}
      </ul>
    </div>
  );
};

export default RequestNameViewer;

