import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../UI';

const NavbarContainer = styled.header`
  background: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  border-bottom: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  padding: ${props => props.theme.spacing?.(3) || '12px'} 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavbarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing?.(4) || '16px'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled(Link)`
  font-size: ${props => props.theme.typography?.fontSize?.xl || '20px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.bold || '700'};
  color: ${props => props.theme.colors?.primary?.[600] || '#0284c7'};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  
  &:hover {
    color: ${props => props.theme.colors?.primary?.[700] || '#0369a1'};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing?.(1) || '4px'};
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(1.5) || '6px'};
  padding: ${props => props.theme.spacing?.(2) || '8px'} ${props => props.theme.spacing?.(3) || '12px'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  text-decoration: none;
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
  transition: all 0.2s ease;
  border: 1px solid transparent;

  ${props => props.$active && `
    background: ${props.theme.colors?.primary?.[50] || '#f0f9ff'};
    color: ${props.theme.colors?.primary?.[700] || '#0369a1'};
    border-color: ${props.theme.colors?.primary?.[200] || '#bae6fd'};
  `}
  
  &:hover {
    background: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
    color: ${props => props.theme.colors?.text?.primary || '#18181b'};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(3) || '12px'};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  padding: ${props => props.theme.spacing?.(2) || '8px'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  background: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'} 0%,
    ${props => props.theme.colors?.secondary?.[500] || '#a855f7'} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography?.fontWeight?.bold || '700'};
  color: white;
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
`;

const UserName = styled.span`
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: ${props => props.theme.spacing?.(2) || '8px'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
  
  &:hover {
    background: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
  }
`;

const MobileMenu = styled.div`
  display: ${props => props.$open ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  border-top: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  padding: ${props => props.theme.spacing?.(2) || '8px'};
  box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(NavLink)`
  justify-content: flex-start;
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  margin: ${props => props.theme.spacing?.(0.5) || '2px'} 0;
`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getUserInitial = () => {
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const navigationItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/projects', label: 'Проекты', icon: '📁' },
    { path: '/analytics', label: 'Аналитика', icon: '📊' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <NavbarContainer>
      <NavbarContent>
        <Brand to="/">
          <span style={{ fontSize: '24px' }}>⏱️</span>
          ТрекерВремени
        </Brand>

        {isAuthenticated ? (
          <>
            <NavLinks>
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  $active={isActive(item.path)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </NavLinks>

            <UserSection>
              <UserInfo>
                <UserAvatar>{getUserInitial()}</UserAvatar>
                <UserName>{user?.username}</UserName>
              </UserInfo>
              
              <Button
                variant="outlined"
                size="sm"
                onClick={handleLogout}
                title="Выйти из системы"
              >
                🚪
              </Button>

              <MobileMenuButton
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                title="Меню"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </MobileMenuButton>
            </UserSection>

            <MobileMenu $open={mobileMenuOpen}>
              {navigationItems.map((item) => (
                <MobileNavLink
                  key={item.path}
                  to={item.path}
                  $active={isActive(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </MobileNavLink>
              ))}
              <MobileNavLink as="button" onClick={handleLogout}>
                <span>🚪</span>
                Выйти
              </MobileNavLink>
            </MobileMenu>
          </>
        ) : (
          <NavLinks>
            <NavLink to="/login">
              <span>🔑</span>
              Войти
            </NavLink>
            <NavLink to="/register">
              <span>📝</span>
              Регистрация
            </NavLink>
          </NavLinks>
        )}
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;