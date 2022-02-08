import { motion, usePresence } from "framer-motion";
import { FC, MouseEventHandler } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useRef } from "react";

interface IModalProps {
  title: string;
  isShown: boolean;
  onClose: MouseEventHandler<HTMLDivElement>;
}

export const Modal: FC<IModalProps> = ({
  children,
  title,
  isShown,
  onClose,
}) => {
  const variants = {
    shown: { opacity: 1 },
    notShown: { opacity: 0 },
  };
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [isElementShown, safeToDelete] = usePresence();
  useEffect(() => {
    if (isShown) {
      modalRef!.current!.scrollIntoView({behavior: "smooth"})
    }
  }, [isShown])
  return (
    <>
      {isShown ? (
        <motion.div
          id="modal-overlay"
          key="modal-overlay"
          variants={variants}
          initial={{ opacity: 0 }}
          animate={isShown ? "shown" : "notShown"}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="modal-overlay"
          ref={modalRef}
        >
          <motion.div
            id="modal-content"
            key="modal-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="modal-content"
          >
            <motion.div
              id="modal-dialog"
              key="modal-dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="modal-dialog"
            >
              <motion.div
                id="modal-header"
                key="modal-header"
                className="modal-header"
              >
                <p
                  className="text-white font-semibold"
                  style={{ textShadow: "1px 1px 2px black" }}
                >
                  {title}
                </p>
                <div className="modal-header-close-button" onClick={onClose}>
                  <AiOutlineClose
                    className="text-[#ff1e56]"
                    style={{ textShadow: "1px 1px 2px black" }}
                    size="22"
                  />
                </div>
              </motion.div>
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </>
  );
};

export const ModalBody: FC<{}> = ({ children }) => {
  return <div className="modal-body">{children}</div>;
};

export const ModalFooter: FC<{}> = ({ children }) => {
  return <div className="modal-footer">{children}</div>;
};