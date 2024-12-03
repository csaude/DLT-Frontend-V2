import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MenuItem } from "@components";
import { queryCountByFilters as beneficiaryQueryCount } from "../../../utils/beneficiary";
import { queryCountByFilters as referenceQueryCount } from "../../../utils/reference";
import {
  allUsersByProfilesAndUser,
  query as queryUser,
} from "../../../utils/users";
import { getUserParams } from "@app/models/Utils";
import { getReferencesTotal } from "../../../store/actions/reference";
import { getBeneficiariesTotal } from "../../../store/actions/beneficiary";
import styled from "styled-components";
import { getUsernames, loadReferers } from "@app/store/actions/users";
import { getProfiles } from "@app/store/actions/profile";
import { getPartners } from "@app/store/actions/partner";
import { getProvinces } from "@app/store/actions/province";
import { getDistricts } from "@app/store/actions/district";
import { getLocalities } from "@app/store/actions/locality";
import { COUNSELOR, MENTOR, NURSE, SUPERVISOR } from "@app/utils/contants";

const StyledUserImage = styled.img`
  height: 4.6rem !important;
  width: 7.2rem !important;
  margin-right: 5 !important;
  margin-left: 20px !important;
`;

export interface IMenuItem {
  name: string;
  path?: string;
  roles?: string[];
  level?: number[];
  icon?: string;
  children?: Array<IMenuItem>;
}

export const MENU: IMenuItem[] = [
  {
    name: "menusidebar.label.beneficiariesList",
    path: "/beneficiariesList",
    icon: "fas fa-users", // icon set: https://fontawesome.com/v5/search
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    roles: [
      "ADMIN",
      "M&E",
      "SUPERVISOR",
      "MENTORA",
      "ENFERMEIRA",
      "CONSELHEIRA",
      "GESTOR",
      "M&E_DOADOR",
    ],
  },
  {
    name: "menusidebar.label.referenceList",
    path: "/referenceList",
    icon: "fas fa-sync",
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    roles: [
      "ADMIN",
      "M&E",
      "SUPERVISOR",
      "MENTORA",
      "ENFERMEIRA",
      "CONSELHEIRA",
      "GESTOR",
      "M&E_DOADOR",
    ],
  },
  {
    name: "menusidebar.label.bulkCancellationReference",
    path: "/bulkReference",
    icon: "fas fa-sync",
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    roles: ["ADMIN", "M&E", "SUPERVISOR", "M&E_DOADOR"],
  },
  {
    name: "menusidebar.label.configurations",
    path: "#",
    icon: "fas fa-cog",
    level: [0],
    roles: ["ADMIN", "M&E", "SUPERVISOR", "M&E_DOADOR"],
    children: [
      {
        name: "Províncias",
        path: "/provinceList",
      },
      {
        name: "Distritos",
        path: "/districtList",
      },
      {
        name: "Postos Administrativos",
        path: "/localityList",
      },
      {
        name: "Bairros Residenciais",
        path: "/neighbourhoodsList",
      },
      {
        name: "Unidades Sanitárias ",
        path: "/usList",
      },
      {
        name: "Serviços",
        path: "/servicesList",
      },
      {
        name: "Sub-Serviços",
        path: "/subServicesList",
      },
      {
        name: "Organizações",
        path: "/organizationsList",
      },
    ],
  },
  {
    name: "menusidebar.label.users",
    path: "/usersList",
    roles: ["ADMIN"],
    icon: "fas fa-user",
    level: [0],
  },
  {
    name: "PEPFAR MER 2.8 AGYW_PREV",
    path: "/reportAgyw",
    roles: ["DOADOR", "MISAU"],
    icon: "fas fa-file-alt",
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    name: "menusidebar.label.reports",
    path: "#",
    icon: "fas fa-file-alt",
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    roles: ["ADMIN", "M&E", "SUPERVISOR", "M&E_DOADOR"],
    children: [
      {
        name: "PEPFAR MER 2.8 AGYW_PREV",
        path: "/reportAgyw",
      },
      {
        name: "menusidebar.label.syncReport",
        path: "/syncReport",
        roles: ["ADMIN"],
        icon: "fas fa-sync",
        level: [0],
      },
      {
        name: "Beneficiárias sem Vulnerabilidades Específicas",
        path: "/benefWithoutVulnerabilites",
      },
      {
        name: "Acompanhamento Completude Pacote Primário",
        path: "/benefWithoutPrimaryPackageCompleted",
      },
      {
        name: "Beneficiárias em Lista de Espera",
        path: "/beneficiariesInWaitingList",
      },
    ],
  },
  {
    name: "menusidebar.label.dataExtraction",
    path: "/dataExtraction",
    roles: ["ADMIN", "M&E", "MISAU", "M&E_DOADOR"],
    icon: "fas fa-list-ul",
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  // {
  //   name: "menusidebar.label.dataImport",
  //   path: "/dataImport",
  //   icon: "fas fa-info-circle", // icon set: https://fontawesome.com/v5/search
  //   level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   roles: ["ADMIN"],
  // },
  {
    name: "menusidebar.label.appInfo",
    path: "/appInfo",
    icon: "fas fa-info-circle", // icon set: https://fontawesome.com/v5/search
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    roles: [
      "ADMIN",
      "M&E",
      "SUPERVISOR",
      "MENTORA",
      "ENFERMEIRA",
      "CONSELHEIRA",
      "GESTOR",
      "MISAU",
      "DOADOR",
      "M&E_DOADOR",
    ],
  },
];

const MenuSidebar = () => {
  const userlogged = useSelector((state: any) => state.auth.user);
  const user = useSelector((state: any) => state.auth.currentUser);
  const sidebarSkin = useSelector((state: any) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state: any) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state: any) => state.ui.menuChildIndent);
  const dispatch = useDispatch();

  const [searchNui, setSearchNui] = useState<any>("");
  const [searchName, setSearchName] = useState<any>("");
  const [searchDistrict, setSearchDistrict] = useState<any>("");
  const [searchUserCreator, setSearchUserCreator] = useState<any>("");

  const getTotals = async () => {
    const user = await queryUser(localStorage.user);
    const beneficiaryTotal = await beneficiaryQueryCount(
      getUserParams(user),
      searchNui,
      searchName,
      searchUserCreator,
      searchDistrict
    );
    const referenceTotal = await referenceQueryCount(
      user.id,
      searchNui,
      searchUserCreator,
      searchDistrict
    );
    const payload = {
      profiles: [SUPERVISOR, MENTOR, NURSE, COUNSELOR].toString(),
      userId: Number(user.id),
    };
    const referers = await allUsersByProfilesAndUser(payload);

    dispatch(getBeneficiariesTotal(beneficiaryTotal));
    dispatch(getReferencesTotal(referenceTotal));
    dispatch(getUsernames());
    dispatch(loadReferers(referers));
    dispatch(getProfiles());
    dispatch(getPartners());
    dispatch(getProvinces());
    dispatch(getDistricts());
    dispatch(getLocalities());
  };

  useEffect(() => {
    getTotals().catch((err) => console.log(err));
  }, [dispatch]);

  return (
    <aside className={`main-sidebar elevation-4 ${sidebarSkin}`}>
      <Link to="/" className="brand-link">
        <StyledUserImage
          src="img/dreams.png"
          alt="DREAMS Logo"
          className=" "
          style={{ opacity: ".8" }}
        />
      </Link>
      <div className="sidebar">
        <nav className="mt-2" style={{ overflowY: "hidden" }}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${
              menuItemFlat ? " nav-flat" : ""
            }${menuChildIndent ? " nav-child-indent" : ""}`}
            role="menu"
          >
            {MENU.map((menuItem: IMenuItem) =>
              menuItem.roles?.includes(user.role) &&
              menuItem.level?.includes(userlogged?.provinces?.length) ? (
                <MenuItem key={menuItem.name} menuItem={menuItem} />
              ) : undefined
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
