import React, {useState, useEffect, useCallback} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Gatekeeper} from 'gatekeeper-client-sdk';
import {loadUser, logoutUser} from '@store/reducers/auth';
import {toggleSidebarMenu} from '@app/store/reducers/ui';
import {addWindowClass, removeWindowClass, sleep} from '@app/utils/helpers';
import ControlSidebar from '@app/modules/main/control-sidebar/ControlSidebar';
import Header from '@app/modules/main/header/Header';
import MenuSidebar from '@app/modules/main/menu-sidebar/MenuSidebar';
import Footer from '@app/modules/main/footer/Footer';
import {useNavigate, useLocation} from 'react-router-dom';
import './index.css'
import { checkPasswordValidity } from '@app/utils/login';

const Main = () => {
  
  const dispatch = useDispatch();
  
  let isNewPassword = localStorage.getItem('isNewPassword');

  const navigate = useNavigate();

  const username = useSelector(
    (state: any) => state.auth.user?.username
  );
  
  const verifyUser = async () =>{
    try {
        await checkPasswordValidity(username)
    } catch (error) {
        const errSt = JSON.stringify(error);
        const errObj = JSON.parse(errSt)
        if(errObj.status==307){
             navigate('/renewPassword');
        }
    }
  }

  const menuSidebarCollapsed = useSelector(
    (state: any) => state.ui.menuSidebarCollapsed
  );
  const controlSidebarCollapsed = useSelector(
    (state: any) => state.ui.controlSidebarCollapsed
  );
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('name');
      const surname = localStorage.getItem('surname');
      const dateCreated = localStorage.getItem('dateCreated'); 
      //const response = await Gatekeeper.getProfile();
      const response = {
        email: email,
        role: role,
        picture: null,
        name: name,
        surname: surname,
        dateCreated: dateCreated,
      }
      dispatch(loadUser(response));
      await sleep(1000);
      setIsAppLoaded(true);
    } catch (error) {
      dispatch(logoutUser());
      await sleep(1000);
      setIsAppLoaded(true);
    }
  };

  useEffect(() => {
    removeWindowClass('register-page');
    removeWindowClass('login-page');
    removeWindowClass('hold-transition');

    addWindowClass('sidebar-mini');

    verifyUser();
    fetchProfile();
    return () => {
      removeWindowClass('sidebar-mini');
    };
  }, []);

  useEffect(() => {
    removeWindowClass('sidebar-closed');
    removeWindowClass('sidebar-collapse');
    removeWindowClass('sidebar-open');
    if (menuSidebarCollapsed && screenSize === 'lg') {
      addWindowClass('sidebar-collapse');
    } else if (menuSidebarCollapsed && screenSize === 'xs') {
      addWindowClass('sidebar-open');
    } else if (!menuSidebarCollapsed && screenSize !== 'lg') {
      addWindowClass('sidebar-closed');
      addWindowClass('sidebar-collapse');
    }
  }, [screenSize, menuSidebarCollapsed]);

  useEffect(() => {
    if (controlSidebarCollapsed) {
      removeWindowClass('control-sidebar-slide-open');
    } else {
      addWindowClass('control-sidebar-slide-open');
    }
  }, [screenSize, controlSidebarCollapsed]);

  const getAppTemplate = useCallback(() => {
    if (!isAppLoaded) {
      return (
        <div className="preloader flex-column justify-content-center align-items-center">
          <img
            className="animation__shake"
            src="img/logo.png"
            alt="AdminLTELogo"
            height="60"
            width="60"
          />
        </div>
      );
    }
    return (
      <div className='apply-z-index-1'>
        <Header />

        <MenuSidebar />

        <div className="content-wrapper">
          <div className="pt-3" />
          <section className="content">
            <Outlet />
          </section>
        </div>
        <Footer />
        <ControlSidebar />
        <div
          id="sidebar-overlay"
          role="presentation"
          onClick={handleToggleMenuSidebar}
          onKeyDown={() => {}}
        />
      </div>
    );
  }, [isAppLoaded]);

  
  return isNewPassword === "1" ? <Navigate to="/newPassword" />  : <div className="wrapper">{getAppTemplate()}</div>;
   
};

export default Main;
