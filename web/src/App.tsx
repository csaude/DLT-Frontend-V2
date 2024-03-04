import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import Main from "@modules/main/Main";
import Login from "@modules/login/Login";
import NewPassword from "@modules/new-password/NewPassword";
import Register from "@modules/register/Register";
import ForgetPassword from "@modules/forgot-password/ForgotPassword";
import RecoverPassword from "@modules/recover-password/RecoverPassword";
import { useWindowSize } from "@app/hooks/useWindowSize";
import { calculateWindowSize } from "@app/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setWindowSize } from "@app/store/reducers/ui";

import Dashboard from "@pages/Dashboard";
import Blank from "@pages/Blank";
import SubMenu from "@pages/SubMenu";
import Profile from "@pages/profile/Profile";
import Users from "@pages/users/Index";
import UsersForm from "@pages/users/Form";
import UserView from "@pages/users/View";
import BeneficiariesList from "@pages/beneficiaries";
import ReferenceList from "@pages/reference/Index";
import BulkReference from "./pages/reference/BulkReference";
import ProvinceList from "@pages/province/index";
import DistrictList from "@pages/district";
import LocalityList from "./pages/locality";
import ServicesList from "@pages/services/index";
import SubServicesList from "./pages/subservices";
import UsList from "@pages/us";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import RenewPassword from "./modules/new-password/RenewPassword";
import OrganizationList from "./pages/organization";
import ReportAgyw from "./pages/report/agyw/ReportAgyw";
import ReportPreview from "./pages/report/agyw/ReportPreview";
import ReportView from "./pages/report/agyw/ReportView";
import AppInfo from "./pages/appInfo";
import DataExtraction from "./pages/report/data-extraction/DataExtraction";
import NeighborhoodsList from "./pages/neighborhoods";

import SyncReport from "@pages/sync-report/Index";
import DataImport from "@pages/data-import/index";

const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const dispatch = useDispatch();
  const [userEvent, setUserEvent] = useState<any>();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  useEffect(() => {
    const handleClick = async () => {
      localStorage.setItem("event", "handleClick");
    };

    const handleKeyboard = async () => {
      localStorage.setItem("event", "handleKeyboard");
    };

    const handleFormSubmit = async () => {
      localStorage.setItem("event", "handleFormSubmit");
    };

    const handleScroll = async () => {
      localStorage.setItem("event", "handleScroll");
    };

    // Add event listeners
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("submit", handleFormSubmit);
    document.addEventListener("scroll", handleScroll);

    // Clean up event listeners
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleFormSubmit);
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [localStorage]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUserEvent(localStorage.getItem("event"));
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        localStorage.clear();
        window.location.reload();
      },
      // 10000 // so para testes
      userRole === "ADMIN" ? 86400000 : 1800000 //
    );
    return () => clearTimeout(timer);
  }, [userEvent]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/register" element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/forgot-password" element={<PublicRoute />}>
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Route>
        <Route path="/recover-password" element={<PublicRoute />}>
          <Route path="/recover-password" element={<RecoverPassword />} />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          {/* // First login after user was create */}
          <Route path="/newPassword" element={<NewPassword />} />
          {/* // Password Expired */}
          <Route path="/renewPassword" element={<RenewPassword />} />
          {/* // Aplication Main */}
          <Route path="/" element={<Main />}>
            <Route path="/sub-menu-2" element={<Blank />} />
            <Route path="/sub-menu-1" element={<SubMenu />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Dashboard />} />
            {/* // Rota de Beneficiaras */}
            <Route path="/beneficiariesList" element={<BeneficiariesList />} />
            {/* //Rota de Referencias */}
            <Route path="/referenceList" element={<ReferenceList />} />
            <Route path="/bulkReference" element={<BulkReference />} />
            {/* // Rota para Utilizadores */}
            <Route path="/usersList" element={<Users />} />
            <Route path="/usersForm" element={<UsersForm />} />
            <Route path="/usersView" element={<UserView />} />
            {/* // Rota de Configurações */}
            <Route path="/provinceList" element={<ProvinceList />} />
            <Route path="/districtList" element={<DistrictList />} />
            <Route path="/localityList" element={<LocalityList />} />
            <Route path="/neighbourhoodsList" element={<NeighborhoodsList />} />
            <Route path="/servicesList" element={<ServicesList />} />
            <Route path="/subServicesList" element={<SubServicesList />} />
            <Route path="/organizationsList" element={<OrganizationList />} />
            <Route path="/usList" element={<UsList />} />
            {/* // Relatorios */}
            <Route path="/reportAgyw" element={<ReportAgyw />} />
            <Route path="/previewAgyw" element={<ReportPreview />} />
            <Route path="/viewAgyw" element={<ReportView />} />
            <Route path="/dataExtraction" element={<DataExtraction />} />
            {/* App Inforation */}
            <Route path="/appInfo" element={<AppInfo />} />
            <Route path="/syncReport" element={<SyncReport />} />
            <Route path="/dataImport" element={<DataImport />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
