import React, { useEffect, useState } from 'react';

const AnimatedAd = () => {
  const [visible, setVisible] = useState(false);
  const [isAdVisible, setIsAdVisible] = useState(true); // State for close button

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handler to close the ad
  const closeAd = () => {
    setIsAdVisible(false);
  };

  if (!isAdVisible) return null; // Hide ad if closed

  return (
    <div
      className={`fixed bottom-5 right-5 bg-white bg-opacity-80 p-3 rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      } z-50 w-72`}
    >
      {/* Close Button */}
      <button
        onClick={closeAd}
        className="absolute top-1 right-1 text-gray-800 hover:text-gray-900 text-2xl transition w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300"
        aria-label="Close ad"
      >
        &times;
      </button>

      <video autoPlay loop muted className="w-full h-auto rounded-lg">
        <source
          src='videos/video1.mp4'
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <p className="mt-2 text-center text-gray-900 font-semibold">
        Check out our latest offers!
      </p>
    </div>
  );
};

export default AnimatedAd;