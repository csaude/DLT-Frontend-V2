import React from "react";
import { Spin } from "antd";
import { Modal } from "antd";
import "./styles.css";

const LoadingModal = ({ modalVisible, message }: any) => {
  const tip =
    message !== undefined ? message : "Carregando, Por Favor Aguarde!";
  return (
    <>
      <Modal
        width={150}
        centered
        destroyOnClose
        visible={modalVisible}
        maskClosable={false}
        footer={null}
        closable={false}
        bodyStyle={{ backgroundColor: "grey" }} // Set modal body background to transparent
      >
        <div>
          <Spin
            className="custom-spin"
            tip={tip}
            size="large"
            style={{ color: "whitesmoke" }}
          />
        </div>
      </Modal>
    </>
  );
};

export default LoadingModal;
