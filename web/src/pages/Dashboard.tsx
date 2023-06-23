import React from 'react';
import { Title} from '@components';
import { Image } from 'antd';
import Background from '../assets/Background.png';

const Dashboard = () => {
  return (
    <div style={{ textAlign: "center",}}>
      <Title />
      <Image
        width={"100%"}
        preview={true}
        src={Background}
      />
    </div>
  );
};

export default Dashboard;
