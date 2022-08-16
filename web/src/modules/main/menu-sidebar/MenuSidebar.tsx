import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {MenuItem} from '@components';
import styled from 'styled-components';

const StyledUserImage = styled.img`
  height: 4.6rem !important;
  width: 7.2rem !important;
  margin-right: 5 !important;
  margin-left: 20px !important;
`;

export interface IMenuItem {
  name: string;
  path?: string;
  role?: string;
  icon?: string;
  children?: Array<IMenuItem>;
}

export const MENU: IMenuItem[] = [
  {
    name: 'menusidebar.label.beneficiariesList',
    path: '/beneficiariesList',
    icon: 'fas fa-users', // icon set: https://fontawesome.com/v5/search
    role: 'ADMIN'
  },
  {
    name: 'menusidebar.label.referenceList',
    path: '/referenceList',
    icon: 'fas fa-sync',
    role: 'ADMIN'
  },
  {
    name: 'menusidebar.label.reports',
    path: '#',
    icon: 'fas fa-file-alt',
    role: 'ADMIN'
  },
  {
    name: 'menusidebar.label.configurations',
    path: '#',
    icon: 'fas fa-cog',
    role: 'ADMIN'
  },
  {
    name: 'menusidebar.label.users',
    path: '/usersList',
    role: 'ADMIN',
    icon: 'fas fa-user',
    /*children: [
      {
        name: 'menusidebar.label.usersList',
        path: '/usersList',
        role: 'ADMIN',
      },

      {
        name: 'menusidebar.label.usersForm',
        path: '/usersForm',
        role: 'ADMIN',
      }
    ]*/
  },
];




const MenuSidebar = () => {
  const user = useSelector((state: any) => state.auth.currentUser);
  const sidebarSkin = useSelector((state: any) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state: any) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state: any) => state.ui.menuChildIndent);


  return (
    <aside className={`main-sidebar elevation-4 ${sidebarSkin}`}>
      <Link to="/" className="brand-link">
        <StyledUserImage
          src="img/dreams.png"
          alt="DREAMS Logo"
          className=" "
          style={{opacity: '.8'}}
        />
      </Link>
      <div className="sidebar">
        
        <nav className="mt-2" style={{overflowY: 'hidden'}}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${
              menuItemFlat ? ' nav-flat' : ''
            }${menuChildIndent ? ' nav-child-indent' : ''}`}
            role="menu"
          >
            {
              MENU.map((menuItem: IMenuItem) => (
                menuItem.role == user.role ? <MenuItem key={menuItem.name} menuItem={menuItem} /> : undefined
              ))
            }
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
