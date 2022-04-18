import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {MenuItem} from '@components';
import styled from 'styled-components';

const StyledUserImage = styled.img`
  height: 4.6rem !important;
  width: 2.2rem !important;
  margin-right: 5 !important;
  margin-left: 20px !important;
`;

export interface IMenuItem {
  name: string;
  path?: string;
  children?: Array<IMenuItem>;
}

export const MENU: IMenuItem[] = [
  // {
  //   name: 'menusidebar.label.dashboard',
  //   path: '/'
  // },
  {
    name: 'menusidebar.label.users',
    children: [
      {
        name: 'menusidebar.label.usersList',
        path: '/usersList'
      },

      {
        name: 'menusidebar.label.usersForm',
        path: '/usersForm'
      }
    ]
  }
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
          src="/img/dreams.png"
          alt="DREAMS Logo"
          className="brand-image elevation-3"
          style={{opacity: '.8'}}
        />
        <span className="brand-text font-weight-light">DLT</span>
      </Link>
      <div className="sidebar">
        
        <nav className="mt-2" style={{overflowY: 'hidden'}}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${
              menuItemFlat ? ' nav-flat' : ''
            }${menuChildIndent ? ' nav-child-indent' : ''}`}
            role="menu"
          >
            {MENU.map((menuItem: IMenuItem) => (
              <MenuItem key={menuItem.name} menuItem={menuItem} />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
