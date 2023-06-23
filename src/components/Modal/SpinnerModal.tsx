import React from "react";
import { FormControl, HStack, Modal, Spinner } from "native-base";

export const SpinnerModal = ({ open, title, message }) => {
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
            <MySpinner/>
            <FormControl.Label>{message}</FormControl.Label>
          </FormControl>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
