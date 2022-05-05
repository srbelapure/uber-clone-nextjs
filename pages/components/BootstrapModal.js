import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";

function RideSuccessfulModal(props) {
  const [show, setShow] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setShow(false);
    if (props.moveToPageName === "Home") {
      router.push("/home");
    } else if (props.moveToPageName === "Search") {
      router.push("/search");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.children}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Click on Close button to move to {props.moveToPageName} page..
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RideSuccessfulModal;
