import React from "react";
import { FormControl, HStack, Modal, Spinner } from "native-base";
import PropTypes from "prop-types";

const SpinnerModal = ({ open, title, message }) => {
  const MySpinner = () => {
    return (
      <HStack space={8} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </HStack>
    );
  };

  return (
    <Modal isOpen={open}>
      <Modal.Content maxWidth="400px">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <FormControl>
            <MySpinner />
            <FormControl.Label>{message}</FormControl.Label>
          </FormControl>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

SpinnerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export { SpinnerModal };
