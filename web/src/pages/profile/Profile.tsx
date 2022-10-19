import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import { useSelector } from 'react-redux';
import {ContentHeader, Button} from '@components'
import PasswordTab from './PasswordTab';
import { Card } from 'antd';

const Profile = () => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const [activeTab, setActiveTab] = useState('PASSWORD');
  let userRole = localStorage.getItem('userRole');
  let username = localStorage.getItem('username');
  let userEmail = localStorage.getItem('userEmail');

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <>
    {console.log(currentUser)}
      <Card bordered={false} style={{ marginBottom: '10px', textAlign: "center", fontWeight: "bold", color: "#17a2b8" }} >
          SISTEMA INTEGRADO DE CADASTRO DE ADOLESCENTES E JOVENS
      </Card>

      <Card title="Perfil" bordered={false} headStyle={{ color: "#17a2b8", fontSize:"150%", }}>         
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <div className="card card-primary card-outline">
                  <div className="card-body box-profile">
                    <div className="text-center">
                      <img
                        className="profile-user-img img-fluid img-circle"
                        src="img/default-profile.png"
                        alt="User profile"
                      />
                    </div>
                    <h3 className="profile-username text-center">
                      {username}
                    </h3>
                    <p className="text-muted text-center"> 
                      {userEmail} 
                    </p>
                    <hr />

                    <strong>
                      <i className="fas fa-map-marker-alt mr-1" />
                      Alocação
                    </strong>
                    <p className="text-muted"> 
                      {userRole} 
                    </p>
                    <hr />
                    <strong>
                      <i className="far fa-file-alt mr-1" />
                      Organização
                    </strong>
                    <p className="text-muted">
                      {currentUser?.partners?.name} 
                    </p>
                  </div>
                  {/* /.card-body */}
                </div>

              </div>
              <div className="col-md-9">
                <div className="card card-primary">
                  <div className="card-header p-8">
                    <h2 className="card-title"> Alteração da Password</h2>
                  </div>
                  <div className="card-body">
                    <div className="tab-content">
                      <PasswordTab isActive={activeTab === 'PASSWORD'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Card>
    </>
  );
};

export default Profile;
