import { ReactNode, useState } from "react";
import { Button, CloseButton, Modal, Spinner } from "react-bootstrap";

import { useAppSelector } from "../app/hooks";
import { selectL1Account } from "../data/accountSlice";
import "./style.scss";

export interface ModalCommonProps {
  btnLabel: ReactNode;
  title: string[];
  children?: ReactNode;
  childrenClass: string;
  valid: boolean;
  handleConfirm?: () => void;
  handleShow?: () => void;
  handleClose?: () => void;
  message: string;
  status: ModalStatus;
  confirmLabel?: ReactNode;
}

export enum ModalStatus {
  PreConfirm,
  Confirmed,
  PostConfirm,
  Error,
}

export const WaitingForResponseBar = () => (
  <Spinner animation="border" variant="light" />
);

export const ModalCommon = ({
  btnLabel,
  title,
  children,
  valid,
  message,
  status,
  confirmLabel,
  handleConfirm,
  ...props
}: ModalCommonProps) => {
  const [show, setShow] = useState(false);

  const account = useAppSelector(selectL1Account);
  const handleClose = () => {
    if (props.handleClose) {
      props.handleClose();
    }
    setShow(false);
  };
  const handleShow = () => {
    if (props.handleShow) {
      props.handleShow();
    }
    setShow(true);
  };

  const Message = () =>
    account?.address ? (
      <div className="modal-error-msg">{message}</div>
    ) : (
      <div>Please connect your wallet before submitting any requests!</div>
    );

  return (
    <>
      <div className="modal-btn" onClick={handleShow}>
        {btnLabel}
      </div>
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-90w"
        role="dialog"
      >
        <div className="common-card-bg-box">
          <Modal.Header>
            <Modal.Title className="w-100 text-center fs-3">
              <span className="gradient-content">{title[0]}</span>
              <span>{title[1]}</span>
            </Modal.Title>
            <CloseButton onClick={handleClose} />
          </Modal.Header>
          <Modal.Body className="show-grid">{children}</Modal.Body>
          <Modal.Footer className="flex-column">
            <Message />

            {handleConfirm && status === ModalStatus.PreConfirm && (
              <Button
                variant="primary"
                disabled={!valid || !account?.address}
                onClick={handleConfirm}
              >
                {!show && <WaitingForResponseBar />}
                {confirmLabel}
              </Button>
            )}
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
