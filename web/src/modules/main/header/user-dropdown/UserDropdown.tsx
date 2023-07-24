import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@store/reducers/auth";
import { Dropdown } from "@components";
import moment from "moment";
import styled from "styled-components";

const StyledUserImage = styled.img`
  height: 1.6rem !important;
  width: 1.6rem !important;
  margin-right: 0 !important;
  margin-left: -8px !important;
`;

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.auth.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logOut = (event: any) => {
    event.preventDefault();
    setDropdownOpen(false);
    dispatch(logoutUser());
    navigate("/login");
  };

  const navigateToProfile = (event: any) => {
    event.preventDefault();
    setDropdownOpen(false);
    navigate("/profile");
  };

  useEffect(() => {
    const handleTabClose = (event) => {
      if (event.currentTarget?.performance.navigation.type === 1) {
        return;
      } else {
        event.preventDefault();
        dispatch(logoutUser());
      }
    };
    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <Dropdown
      isOpen={dropdownOpen}
      onChange={(open: boolean) => setDropdownOpen(open)}
      className="user-menu"
      menuContainerTag="ul"
      buttonTemplate={
        <StyledUserImage
          src={currentUser.picture || "img/default-profile.png"}
          className="user-image img-circle elevation-2"
          alt="User"
        />
      }
      menuTemplate={
        <>
          <li className="user-header bg-info">
            <img
              src={currentUser.picture || "img/default-profile.png"}
              className="img-circle elevation-2"
              alt="User"
            />
            <p>
              {currentUser?.name + " " + currentUser?.surname}
              <small>
                <span>Membro desde </span>
                <span>
                  {moment(currentUser?.dateCreated).format("YYYY-MM-DD")}
                </span>
              </small>
            </p>
          </li>
          <li className="user-footer">
            <button
              type="button"
              className="btn btn-default btn-flat"
              onClick={navigateToProfile}
            >
              {/* {t('header.user.profile')} */}
              Perfil
            </button>
            <button
              type="button"
              className="btn btn-default btn-flat float-right"
              onClick={logOut}
            >
              {/* {t('login.button.signOut')} */}
              Sair
            </button>
          </li>
        </>
      }
    />
  );
};

export default UserDropdown;
