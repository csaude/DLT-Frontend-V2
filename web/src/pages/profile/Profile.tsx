import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
<<<<<<< HEAD
import {ContentHeader, Button} from '@components'
=======
import {ContentHeader, Button} from '@components';
import ActivityTab from './ActivityTab';
import TimelineTab from './TimelineTab';
import SettingsTab from './SettingsTab';
>>>>>>> upstream/test
import PasswordTab from './PasswordTab';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('PASSWORD');
<<<<<<< HEAD
  let userRole = localStorage.getItem('userRole');
  let username = localStorage.getItem('username');
  let userEmail = localStorage.getItem('userEmail');
=======
  const [t] = useTranslation();

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
>>>>>>> upstream/test

  return (
    <>
      <ContentHeader title="Profile" />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <div className="text-center">
                    <img
                      className="profile-user-img img-fluid img-circle"
                      src="/img/default-profile.png"
                      alt="User profile"
                    />
                  </div>
                  <h3 className="profile-username text-center">
<<<<<<< HEAD
                    {username}
                  </h3>
                  <p className="text-muted text-center"> 
                    {userEmail} 
                  </p>
=======
                    Nome do utilizador
                  </h3>
                  <p className="text-muted text-center">Tipo de utilizador</p>
>>>>>>> upstream/test
                  <hr />
                  
                  <strong>
                    <i className="fas fa-map-marker-alt mr-1" />
                    Alocação
                  </strong>
<<<<<<< HEAD
                  <p className="text-muted"> 
                    {userRole} 
                  </p>
=======
                  <p className="text-muted">Distrito, Provincia</p>
>>>>>>> upstream/test
                  <hr />
                  <strong>
                    <i className="far fa-file-alt mr-1" />
                    Organização
                  </strong>
                  <p className="text-muted">
<<<<<<< HEAD
                    {userEmail} 
=======
                    Etiam fermentum enim neque.
>>>>>>> upstream/test
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
    </>
  );
};

export default Profile;
