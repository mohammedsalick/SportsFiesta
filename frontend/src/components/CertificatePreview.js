import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const CertificatePreview = ({ participantName, eventName = "SportsFiesta 2023", children }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const certificateRef = useRef(null);

  const togglePreview = () => setIsPreviewOpen(!isPreviewOpen);

  const downloadCertificate = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `${participantName || 'participant'}_certificate.png`;
        link.click();
      });
    }
  };

  return (
    <>
      {children({ openPreview: togglePreview })}

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={togglePreview}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-lg max-w-2xl w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div ref={certificateRef} className="border-8 border-double border-gold p-8 text-center bg-cream">
                <h2 className="text-4xl font-bold mb-6 text-gold">Certificate of Participation</h2>
                <p className="text-xl mb-4">This is to certify that</p>
                <p className="text-3xl font-bold mb-4 text-blue-600">{participantName || 'Participant'}</p>
                <p className="text-xl mb-4">has successfully participated in</p>
                <p className="text-3xl font-bold mb-8 text-green-600">{eventName}</p>
                <div className="mt-12 pt-8 border-t border-gray-300">
                  <p className="font-bold">Event Organizer</p>
                  <p>SportsFiesta Committee</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={togglePreview}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Close Preview
                </button>
                <button
                  onClick={downloadCertificate}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Download Certificate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CertificatePreview;
