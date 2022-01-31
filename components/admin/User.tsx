import { motion } from "framer-motion";
import { MouseEventHandler, useState } from "react";

interface IAdmin {
  id: string;
  data: {
    email: string;
  };
  index: number;
  modal: MouseEventHandler<HTMLButtonElement>;
}

export default function User({ id, data, index, modal }: IAdmin) {
  const [animate, setAnimate] = useState("");
  return (
    <motion.div
      id="wrapper"
      key="wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row bg-silver-chalice-900 bg-opacity-60 rounded-lg p-2 justify-between content-center"
    >
      <motion.div
        id="index"
        key="index"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ml-2 flex content-center"
      >
        <p className="my-auto">{index + 1}.</p>
      </motion.div>
      <motion.div
        id="email"
        key="email"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex"
      >
        <p className="font-normal my-auto">{data.email}</p>
      </motion.div>
      <motion.div
        id="delete-button"
        key="delete-button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          className={`danger-button w-full px-4 mr-2 ${animate}`}
          onClick={(e) => {
            setAnimate("animate-click");
            modal(e);
          }}
          onAnimationEnd={() => setAnimate("")}
          style={{ textShadow: "1px 1px 2px black" }}
        >
          Izbriši
        </button>
      </motion.div>
    </motion.div>
  );
}
