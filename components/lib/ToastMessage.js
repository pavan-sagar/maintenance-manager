import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function ToastMessage({ success, duration, children }) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setShowToast(true);

    //Show Toast notification for 'duration' number of seconds
    setTimeout(() => {
      setShowToast(false);
    }, duration * 1000);
  }, []);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`py-2 px-[1.5rem] text-center border-2 font-sans font-light rounded-md ${
            success ? "bg-green-500" : "bg-red-300"
          }`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ToastMessage;
