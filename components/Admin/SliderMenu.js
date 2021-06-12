import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sling as Hamburger } from "hamburger-react";

export const SliderMenu = ({ items }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="h-screen flex">
      <Hamburger toggled={isOpen} toggle={setOpen} />
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="inline-block rounded-lg border-1 shadow-2xl border-gray-400 h-full w-[60%] md:w-[17rem] "
              key="nice"
              animate={{ x: -50 }}
              initial={{ x: "-100%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
            >
              <p class="flex flex-col items-center mt-14">
                {items.map((item) => (
                  <p
                    className="rounded-lg text-center w-[90%] p-2 hover:bg-blue-100"
                    onClick={() => {
                      setOpen((prevState) => !prevState);
                      item.action();
                    }}
                  >
                    {item.name}
                  </p>
                ))}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
