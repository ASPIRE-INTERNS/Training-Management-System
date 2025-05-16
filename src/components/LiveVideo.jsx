import React from 'react';

const LiveVideo = ({ sessionId, streamUrl }) => {
  // In a real implementation, you would connect to a streaming service
  // For now, we'll just show a placeholder
  
  return (
    <div className="bg-black w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center">
      {streamUrl ? (
        <video 
          controls 
          autoPlay 
          className="w-full h-full"
        >
          <source src={streamUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="text-white text-center p-4">
          <div className="text-6xl mb-4">📹</div>
          <p className="text-xl">Live Video Placeholder</p>
          <p className="text-sm mt-2">Session ID: {sessionId}</p>
        </div>
      )}
    </div>
  );
};

export default LiveVideo;