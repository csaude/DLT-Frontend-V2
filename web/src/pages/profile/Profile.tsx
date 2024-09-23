import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Title } from "@components";
import PasswordTab from "./PasswordTab";
import { Card } from "antd";

const Profile = () => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const [activeTab] = useState("PASSWORD");
  const username = localStorage.getItem("username");

  return (
    <>
      <Title />
      <Card
        title="Perfil"
        bordered={false}
        headStyle={{ color: "#17a2b8", fontSize: "150%" }}
      >
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-5">
                <div className="card card-primary card-outline">
                  <div className="card-body box-profile">
                    <div className="text-center">
                      <img
                        className="profile-user-img img-fluid img-circle"
                        src="img/default-profile.png"
                        alt="User profile"
                      />
                    </div>
                    <h3 className="profile-username text-center">{username}</h3>
                    <p className="text-muted text-center">
                      {currentUser?.name} {currentUser?.surname} |{" "}
                      {currentUser?.profiles?.description}
                    </p>
                    <hr />

                    <strong>
                      <i className="fas fa-at mr-2" />
                      E-Mail pessoal/supervisor
                    </strong>
                    <p className="text-muted">{currentUser?.email}</p>
                    <hr />
                    <strong>
                      <i className="fas fa-landmark mr-2" />
                      Organização
                    </strong>
                    <p className="text-muted">{currentUser?.partners?.name}</p>
                    <hr />
                    <strong>
                      <i className="fas fa-map-marked mr-2" />
                      Província(s)
                    </strong>
                    <p className="text-muted">
                      {currentUser?.provinces?.map((u) => u.name + ", ")}
                    </p>
                    <hr />
                    <strong>
                      <i className="fas fa-map-marked-alt mr-2" />
                      Distrito(s)
                    </strong>
                    <p className="text-muted">
                      {currentUser?.districts?.map((u) => u.name + ", ")}
                    </p>
                    <hr />
                    <strong>
                      <i className="fas fa-map-marker mr-2" />
                      Posto(s) Administrativo(s)
                    </strong>
                    <p className="text-muted">
                      {currentUser?.localities?.map((u) => u.name + ", ")}
                    </p>
                    <hr />
                    <strong>
                      <i className="fas fa-map-marker-alt mr-2" />
                      Alocação
                    </strong>
                    <p className="text-muted">
                      {currentUser?.us?.map((u) => u.name + ", ")}
                    </p>
                  </div>
                  {/* /.card-body */}
                </div>
                {/* /.card-body */}
              </div>
              <div className="col-md-7">
                <div className="card card-primary">
                  <div className="card-header p-8">
                    <h2 className="card-title"> Alteração da Password</h2>
                  </div>
                  <div className="card-body">
                    <div className="tab-content">
                      <PasswordTab isActive={activeTab === "PASSWORD"} />
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
