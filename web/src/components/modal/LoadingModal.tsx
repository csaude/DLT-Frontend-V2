import React from "react";
import { Space, Spin } from "antd";
import "./styles.css";

import { Modal } from "antd";
import "./styles.css";

const LoadingModal = ({ modalVisible, message }: any) => {
  const tip = message != undefined ? message : "Carregando. Aguarde Por Favor.";
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
      >
        <div>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <Spin tip={message} size="large">
                <div className="content" />
              </Spin>
            </Space>
          </Space>
        </div>
      </Modal>
    </>
  );
};
export default LoadingModal;
