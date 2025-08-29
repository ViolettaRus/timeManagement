import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { Container } from '../UI';
import Breadcrumbs from './Breadcrumbs';

const LayoutContainer = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: ${props => props.theme.colors?.background?.default || '#ffffff'};
`;

const MainContent = styled.main`
  padding: ${props => props.theme.spacing?.(6) || '24px'} 0;
  min-height: calc(100vh - 80px);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing?.(6) || '24px'};
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>
        <Container>
          <ContentWrapper>
            <Breadcrumbs />
            {children}
          </ContentWrapper>
        </Container>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;