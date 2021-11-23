// import React, { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom";
// import styled from "styled-components";

// const Modal = ({ show, onClose, children, title }) => {
// const [isBrowser, setIsBrowser] = useState(false);

//   useEffect(() => {
//     setIsBrowser(true);
//   }, []);

//   const handleCloseClick = (e) => {
//     e.preventDefault();
//     onClose();
//   };

//   const modalContent = show ? (
//     <StyledModalOverlay>
//       <StyledModal>
//         <StyledModalHeader>
//           <a href="#" onClick={handleCloseClick}>
//             x
//           </a>
//         </StyledModalHeader>
//         {title && <StyledModalTitle>{title}</StyledModalTitle>}
//         <StyledModalBody>{children}</StyledModalBody>
//       </StyledModal>
//     </StyledModalOverlay>
//   ) : null;

//   if (isBrowser) {
//     return(
//         ReactDOM.createPortal(
//             modalContent,
//             document.getElementById("modal-root")
//           )
//     )
//   } else {
//     return null;
//   }
// };

// export default Modal

// const StyledModalBody = styled.div`
//   padding-top: 10px;
// `;

// const StyledModalHeader = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   font-size: 25px;
// `;

// const StyledModal = styled.div`
//   background: white;
//   width: 500px;
//   height: 600px;
//   border-radius: 15px;
//   padding: 15px;
// `;
// const StyledModalOverlay = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background-color: rgba(0, 0, 0, 0.5);
// `;



























import React,{useState} from "react";

// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import tw from "tailwind-styled-components";

function Popup(props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ConfirmButton
        type="button"
        onClick={() => setModalOpen(!modalOpen)}
        disabled= {props.confirmButtonEnabled===false? true: false}
      >
        {props.buttonTitle}
      </ConfirmButton>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        {/* <div className=" modal-header">
          <h5 className=" modal-title" id="exampleModalLabel">
            Modal title
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div> */}
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Close
          </Button>
          {/* <Button color="primary" type="button">
            Save changes
          </Button> */}
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Popup;


const ConfirmButton = tw.button`bg-black text-white w-screen my-4 mx-4 text-center py-4 text-xl disabled:cursor-not-allowed`;