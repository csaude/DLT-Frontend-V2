import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation, Location } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMenuItem } from "@app/modules/main/menu-sidebar/MenuSidebar";
import { useSelector,useDispatch } from "react-redux";
import { query as beneficiaryQuery } from '../../utils/beneficiary';
import { query as referenceQuery } from '../../utils/reference';
import { query as queryUser } from '../../utils/users';
import { getUserParams } from '@app/models/Utils';
import { getReferencesTotal } from '../../store/actions/reference';
import { getBeneficiaryTotal } from '../../store/actions/beneficiary';

const MenuItem = ({ menuItem }: { menuItem: IMenuItem }) => {
  const [t] = useTranslation();
  const [isMenuExtended, setIsMenuExtended] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const benefiarySelector = useSelector(
    (state: any) => state.beneficiary.total
  );
  const referenceSelector = useSelector(
    (state: any) => state.reference.total
  );
  const toggleMenu = () => {
    setIsMenuExtended(!isMenuExtended);
  };

  const handleMainMenuAction = () => {
    if (isExpandable) {
      toggleMenu();
      return;
    }
    navigate(menuItem.path ? menuItem.path : '/');
  };

  const calculateIsActive = (url: Location) => {
    setIsMainActive(false);
    setIsOneOfChildrenActive(false);
    if (isExpandable && menuItem && menuItem.children) {
      menuItem.children.forEach((item) => {
        if (item.path === url.pathname) {
          setIsOneOfChildrenActive(true);
          setIsMenuExtended(true);
        }
      });
    } else if (menuItem.path === url.pathname) {
      setIsMainActive(true);
    }
  };

  const getTotalRegistered = (menuName) => {
    if (menuName === "menusidebar.label.beneficiariesList") {
      return benefiarySelector && <Fragment>({benefiarySelector})</Fragment>;
    } else if (menuName === "menusidebar.label.referenceList") {
      return referenceSelector && <Fragment> ({referenceSelector}) </Fragment>;
    }else return
  };

  useEffect(() => {
    if (location) {
      calculateIsActive(location);
    }
  }, [location, isExpandable, menuItem]);

  useEffect(() => {
    if (!isMainActive && !isOneOfChildrenActive) {
      setIsMenuExtended(false);
    }
  }, [isMainActive, isOneOfChildrenActive]);

  useEffect(() => {
    setIsExpandable(
      Boolean(menuItem && menuItem.children && menuItem.children.length > 0)
    );
  }, [menuItem]);

   const getTotals = async () =>{
      const user = await queryUser(localStorage.user);
      const beneficiaryData = await beneficiaryQuery(getUserParams(user));
      const referenceData = await referenceQuery();
      dispatch(getBeneficiaryTotal(beneficiaryData.length))
      dispatch(getReferencesTotal(referenceData.length))
    }
  useEffect(()=>{
    getTotals()
  },[getTotals,dispatch])

  return (
    <li className={`nav-item${isMenuExtended ? ' menu-open' : ''}`}>
      <a
        className={`nav-link${
          isMainActive || isOneOfChildrenActive ? ' active' : ''
        }`}
        role="link"
        onClick={handleMainMenuAction}
        style={{cursor: 'pointer'}}
      >
        <i className={`nav-icon ${menuItem.icon}`} />
        <p>
          {t(menuItem.name)} {getTotalRegistered(menuItem.name)}{" "}
        </p>
        {isExpandable ? <i className="right fas fa-angle-left" /> : null}
      </a>

      {isExpandable &&
        menuItem &&
        menuItem.children &&
        menuItem.children.map((item) => (
          <ul key={item.name} className="nav nav-treeview">
            <li className="nav-item">
              <NavLink className="nav-link" to={`${item.path}`}>
                <i className="far fa-circle nav-icon" />
                <p>{t(item.name)}</p>
              </NavLink>
            </li>
          </ul>
        ))}
    </li>
  );
};

export default MenuItem;
