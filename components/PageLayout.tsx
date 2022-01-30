import { motion } from "framer-motion";
import { FC } from "react";
import Navbar from "./Navbar";

interface IPageProps {
  id?: string;
}

const PageLayout: FC<IPageProps> = ({ children, id }) => {
  return (
    <motion.div
      id={id}
      key="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      <Navbar />
      <div id="bg" className="login-bg filter brightness-[25%]" />
      <div className="content">
        {children}
      </div>
    </motion.div>
  );
};

export default PageLayout