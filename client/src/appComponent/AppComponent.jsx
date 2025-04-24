import React, { useState } from "react";
import "./appComponent.scss";
// import ImageComponent from "../imageComponent/ImageComponent";
import FormComponent from "../formComponent/FormComponent";
import VideoComponent from "../videoComponent/VideoComponent";
import FormComponent2 from "../formComponent2/FormComponent2";

export default function AppComponent() {
  const [progress, setProgress] = useState(0);

  // Function to update progress
  const updateProgress = (filledFields, totalFields) => {
    const newProgress = (filledFields / totalFields) * 100; // Calculate percentage
    setProgress(newProgress);

    

  };
  console.log(progress);
  
  return (
    <div className="appComp">
      {/* <div className="imageCont">
        <ImageComponent progress={progress} />
      </div> */}
      <div className="videoComp">
        <VideoComponent progress={progress} />
      </div>
      {/* <div className="fornCont">
        <FormComponent updateProgress={updateProgress} />
      </div> */}
      <div className="fornCont">
        <FormComponent2 updateProgress={updateProgress} />
      </div>
    </div>
  );
}
