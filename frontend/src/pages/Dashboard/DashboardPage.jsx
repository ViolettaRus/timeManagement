import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Timer from '../../components/Timer/Timer';
import { Container, Card, H2 } from '../../components/UI';
import { formatTime, getTimeUnitLabel } from '../../utils/timeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeEntries } from '../../store/slices/timeEntriesSlice';
import { fetchProjects } from '../../store/slices/projectsSlice';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing?.(8) || '32px'};
  min-height: calc(100vh - 80px);
`;

const HeroSection = styled.section`
  text-align: center;
  padding: ${props => props.theme.spacing?.(12) || '48px'} 0;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors?.primary?.[50] || '#f0f9ff'} 0%,
    ${props => props.theme.colors?.background?.default || '#ffffff'} 100%
  );
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing?.(8) || '32px'} 0;
  }
`;

const HeroTitle = styled.h1`
  font-size: ${props => props.theme.typography?.fontSize?.['4xl'] || '36px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.bold || '700'};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors?.primary?.[600] || '#0284c7'} 0%, 
    ${props => props.theme.colors?.secondary?.[600] || '#9333ea'} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing?.(4) || '16px'};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography?.fontSize?.['3xl'] || '30px'};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${props => props.theme.typography?.fontSize?.xl || '20px'};
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography?.fontSize?.lg || '18px'};
  }
`;

const TimerSection = styled.section`
  display: flex;
  justify-content: center;
`;

const TimerWrapper = styled.div`
  width: 100%;
  max-width: 500px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing?.(4) || '16px'};
  margin-top: ${props => props.theme.spacing?.(8) || '32px'};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing?.(6) || '24px'};
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.theme.colors?.primary?.[400] || '#38bdf8'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing?.(3) || '12px'};
  opacity: 0.8;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography?.fontSize?.['3xl'] || '30px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.bold || '700'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
  margin-bottom: ${props => props.theme.spacing?.(1) || '4px'};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
`;

const FeaturesSection = styled.section`
  margin-top: ${props => props.theme.spacing?.(12) || '48px'};
`;

const SectionTitle = styled(H2)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing?.(8) || '32px'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${props => props.theme.spacing?.(6) || '24px'};
`;

const FeatureCard = styled(Card)`
  padding: ${props => props.theme.spacing?.(6) || '24px'};
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.theme.colors?.primary?.[200] || '#bae6fd'};
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing?.(4) || '16px'};
  color: ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'};
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.typography?.fontSize?.xl || '20px'};
  margin-bottom: ${props => props.theme.spacing?.(2) || '8px'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  line-height: 1.6;
`;

const UnitSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing?.(3) || '12px'};
  margin: ${props => props.theme.spacing?.(8) || '32px'} 0;
  padding: ${props => props.theme.spacing?.(4) || '16px'};
  background: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
  border-radius: ${props => props.theme.borderRadius?.lg || '12px'};
  
  span {
    font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
    color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
    font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
  }
`;

const UnitSelect = styled.select`
  padding: ${props => props.theme.spacing?.(2) || '8px'} ${props => props.theme.spacing?.(3) || '12px'};
  border: 1px solid ${props => props.theme.colors?.border?.medium || '#d4d4d8'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  background: ${props => props.theme.colors?.background?.default || '#ffffff'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'};
    box-shadow: 0 0 0 3px ${props => props.theme.colors?.primary?.[100] || '#e0f2fe'};
  }
`;

const DashboardPage = () => {
  const [timeUnit, setTimeUnit] = useState('hours');
  const dispatch = useDispatch();
  const { items: entries = [] } = useSelector(state => state.timeEntries);
  const { items: projects = [] } = useSelector(state => state.projects);

  useEffect(() => {
    dispatch(fetchTimeEntries());
    dispatch(fetchProjects());
  }, [dispatch]);

  const totalSeconds = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeDays = new Set(entries.map(entry => 
    new Date(entry.startTime).toDateString()
  )).size;

  const stats = [
    { icon: '⏱️', value: totalSeconds, label: 'Общее время', unit: 'time' },
    { icon: '📊', value: completedProjects, label: 'Завершенных проектов', unit: 'count' },
    { icon: '📅', value: activeDays, label: 'Активных дней', unit: 'count' },
    { icon: '📝', value: entries.length, label: 'Записей времени', unit: 'count' }
  ];

  const features = [
    { 
      icon: '⚡', 
      title: 'Быстрый старт', 
      description: 'Начинайте отсчет времени в один клик без лишних действий' 
    },
    { 
      icon: '📈', 
      title: 'Детальная аналитика', 
      description: 'Получайте подробные отчеты и графики о вашей продуктивности' 
    },
    { 
      icon: '🎨', 
      title: 'Интуитивный интерфейс', 
      description: 'Современный и понятный дизайн для комфортной работы' 
    }
  ];

  return (
    <Container>
      <DashboardContainer>
        <HeroSection>
          <HeroTitle>Умный трекер времени</HeroTitle>
          <HeroSubtitle>
            Отслеживайте свою продуктивность, анализируйте прогресс 
            и достигайте большего с современным трекером времени
          </HeroSubtitle>
        </HeroSection>

        <TimerSection>
          <TimerWrapper>
            <Timer />
          </TimerWrapper>
        </TimerSection>

        <UnitSelector>
          <span>Показать время в:</span>
          <UnitSelect
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <option value="hours">Часах</option>
            <option value="minutes">Минутах</option>
            <option value="seconds">Секундах</option>
          </UnitSelect>
        </UnitSelector>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon>{stat.icon}</StatIcon>
              <StatValue>
                {stat.unit === 'time' ? formatTime(stat.value, timeUnit) : stat.value}
              </StatValue>
              <StatLabel>
                {stat.label}
                {stat.unit === 'time' && ` (${getTimeUnitLabel(timeUnit)})`}
              </StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <FeaturesSection>
          <SectionTitle>Почему выбирают нас</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>
      </DashboardContainer>
    </Container>
  );
};

export default DashboardPage;