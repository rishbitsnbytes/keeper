import { ToastContainer } from "react-toastify";
import ReactDOM from "react-dom";
import "react-toastify/dist/ReactToastify.css";

const Portal = () => {
  return ReactDOM.createPortal(
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />,
    document.getElementById("portal")
  );
};

export default Portal;
