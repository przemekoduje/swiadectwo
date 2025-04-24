import React from 'react'
import './videoComponent.scss'
import { useEffect, useRef } from 'react';

const VideoComponent = ({ progress }) => {
  const videoRef = useRef(null);

  console.log(videoRef)

  useEffect(() => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      const videoDuration = videoRef.current.duration;
      const newTime = (progress / 100) * videoDuration;
      videoRef.current.currentTime = newTime;
    }
  }, [progress]);

  return (
    <video ref={videoRef} src="/images/video.mp4" width="500" height="500" />
  );
};

export default VideoComponent;