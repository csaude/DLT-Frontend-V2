import { Form, Modal } from "antd";
import Spinner from "../spinner";
import "./styles.css";

const LoadingModal = ({ modalVisible }: any) => {
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
          <Spinner />
        </div>
      </Modal>
    </>
  );
};
export default LoadingModal;
