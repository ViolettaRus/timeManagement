import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  margin-bottom: ${props => props.theme.spacing?.(2) || '8px'};
`;

const BreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  
  &:not(:last-child)::after {
    content: '/';
    color: ${props => props.theme.colors?.border?.medium || '#d4d4d8'};
  }
`;

const BreadcrumbLink = styled(Link)`
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors?.primary?.[600] || '#0284c7'};
  }
`;

const BreadcrumbCurrent = styled.span`
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
`;

const getBreadcrumbName = (path) => {
  const breadcrumbMap = {
    '': 'Главная',
    'projects': 'Проекты',
    'analytics': 'Аналитика',
    'settings': 'Настройки',
    'login': 'Вход',
    'register': 'Регистрация'
  };
  
  return breadcrumbMap[path] || path;
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <BreadcrumbsContainer aria-label="Хлебные крошки">
      <BreadcrumbItem>
        <BreadcrumbLink to="/">🏠 Главная</BreadcrumbLink>
      </BreadcrumbItem>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <BreadcrumbItem key={to}>
            {isLast ? (
              <BreadcrumbCurrent>
                {getBreadcrumbName(value)}
              </BreadcrumbCurrent>
            ) : (
              <BreadcrumbLink to={to}>
                {getBreadcrumbName(value)}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;