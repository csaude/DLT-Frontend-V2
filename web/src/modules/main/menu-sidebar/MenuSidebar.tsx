import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MenuItem } from "@components";
import { queryCountByFilters as beneficiaryQueryCount } from "../../../utils/beneficiary";
import { queryCountByFilters as referenceQueryCount } from "../../../utils/reference";
import { query as queryUser } from "../../../utils/users";
import { getUserParams } from "@app/models/Utils";
import { getReferencesTotal } from "../../../store/actions/reference";
import { getBeneficiariesTotal } from "../../../store/actions/beneficiary";
import styled from "styled-components";
import { getInterventionsCount } from "@app/store/actions/interventions";
import { getUsernames } from "@app/store/actions/users";

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
    ],
  },
  {
    name: "menusidebar.label.configurations",
    path: "#",
    icon: "fas fa-cog",
    level: [0],
    roles: ["ADMIN", "M&E", "SUPERVISOR"],
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
    name: "menusidebar.label.reports",
    path: "#",
    icon: "fas fa-file-alt",
    level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    roles: ["ADMIN", "M&E", "SUPERVISOR", "DOADOR"],
    children: [
      // {
      //   name: '>> GERAL',
      //   path: '#',
      // },
      // {
      //   name: '>> FILTROS DREAMS',
      //   path: '#',
      // },
      // {
      //   name: '>> FILTROS MENSAL',
      //   path: '#',
      // },
      // {
      //   name: '>> FILTROS UTILIZADORES',
      //   path: '#',
      // },
      {
        name: ">> PEPFAR MER 2.6.1 AGYW_PREV",
        path: "/reportAgyw",
      },
      // {
      //   name: '>> FY19',
      //   path: '#',
      // },
      // {
      //   name: '>> FY20',
      //   path: '#',
      // },
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
  const [searchDistrict, setSearchDistrict] = useState<any>("");
  const [searchUserCreator, setSearchUserCreator] = useState<any>("");

  const getTotals = async () => {
    const user = await queryUser(localStorage.user);
    const beneficiaryTotal = await beneficiaryQueryCount(
      getUserParams(user),
      searchNui,
      searchUserCreator,
      searchDistrict
    );
    const referenceTotal = await referenceQueryCount(
      user.id,
      searchNui,
      searchUserCreator,
      searchDistrict
    );
    dispatch(getBeneficiariesTotal(beneficiaryTotal));
    dispatch(getReferencesTotal(referenceTotal));
    dispatch(getInterventionsCount());
    dispatch(getUsernames());
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
