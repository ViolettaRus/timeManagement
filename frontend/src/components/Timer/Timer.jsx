import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { saveTimeEntry } from '../../store/slices/timeEntriesSlice';
import {
  Card,
  FormControl,
  Label,
  Select,
  TextArea,
  Button
} from '../UI';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TimerContainer = styled(Card)`
  padding: ${props => props.theme.spacing?.(6) || '24px'};
  background: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  border-radius: ${props => props.theme.borderRadius?.xl || '16px'};
  box-shadow: ${props => props.theme.shadows?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
  border: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  animation: ${fadeIn} 0.3s ease;
`;

const TimerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing?.(6) || '24px'};
  flex-direction: column;
  gap: ${props => props.theme.spacing?.(4) || '16px'};
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
  }
`;

const TimerVisual = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;
`;

const TimerCircle = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const TimerBackground = styled.circle`
  fill: none;
  stroke: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
  stroke-width: 8;
`;

const TimerProgress = styled.circle`
  fill: none;
  stroke: ${props => props.$isRunning ? 
    (props.theme.colors?.success?.[500] || '#22c55e') : 
    (props.theme.colors?.primary?.[500] || '#0ea5e9')
  };
  stroke-width: 8;
  stroke-linecap: round;
  transition: all 0.3s ease;
`;

const TimerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
`;

const TimeDisplay = styled.div`
  flex: 1;
  min-width: 200px;
`;

const TimeText = styled.h1`
  font-size: 2.5rem;
  font-weight: ${props => props.theme.typography?.fontWeight?.bold || '700'};
  margin: 0;
  font-family: 'Courier New', monospace;
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  ${props => props.$isRunning && css`
    color: ${props.theme.colors?.success?.[600] || '#16a34a'};
    animation: ${pulse} 2s infinite;
  `}
  
  ${props => props.$isPaused && css`
    color: ${props.theme.colors?.warning?.[600] || '#d97706'};
  `}
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(1) || '4px'};
  padding: ${props => props.theme.spacing?.(1) || '4px'} ${props => props.theme.spacing?.(2) || '8px'};
  border-radius: ${props => props.theme.borderRadius?.full || '9999px'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
  margin-top: ${props => props.theme.spacing?.(2) || '8px'};
  
  background: ${props => {
    if (props.$isRunning) return props.theme.colors?.success?.[100] || '#dcfce7';
    if (props.$isPaused) return props.theme.colors?.warning?.[100] || '#fef3c7';
    return props.theme.colors?.primary?.[100] || '#e0f2fe';
  }};
  
  color: ${props => {
    if (props.$isRunning) return props.theme.colors?.success?.[800] || '#166534';
    if (props.$isPaused) return props.theme.colors?.warning?.[800] || '#92400e';
    return props.theme.colors?.primary?.[800] || '#075985';
  }};
`;

const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const ControlButton = styled(Button)`
  min-width: 100px;
  min-height: 60px;
  font-size: 1.5rem;
  border-radius: ${props => props.theme.borderRadius?.xl || '16px'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing?.(1) || '4px'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    min-width: 80px;
    min-height: 50px;
    font-size: 1.25rem;
  }
`;

const ButtonText = styled.span`
  font-size: ${props => props.theme.typography?.fontSize?.xs || '12px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing?.(4) || '16px'};
  margin-bottom: ${props => props.theme.spacing?.(6) || '24px'};
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProjectSelect = styled(Select)`
  background: ${props => props.theme.colors?.background?.default || '#ffffff'};
  border: 2px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  border-radius: ${props => props.theme.borderRadius?.lg || '12px'};
  padding: ${props => props.theme.spacing?.(3) || '12px'};
  font-size: ${props => props.theme.typography?.fontSize?.base || '16px'};
  
  &:focus {
    border-color: ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'};
    box-shadow: 0 0 0 3px ${props => props.theme.colors?.primary?.[100] || '#e0f2fe'};
    outline: none;
  }
  
  &:disabled {
    background: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
    color: ${props => props.theme.colors?.text?.disabled || '#a1a1aa'};
  }
`;

const DescriptionTextArea = styled(TextArea)`
  background: ${props => props.theme.colors?.background?.default || '#ffffff'};
  border: 2px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  border-radius: ${props => props.theme.borderRadius?.lg || '12px'};
  padding: ${props => props.theme.spacing?.(3) || '12px'};
  font-size: ${props => props.theme.typography?.fontSize?.base || '16px'};
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    border-color: ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'};
    box-shadow: 0 0 0 3px ${props => props.theme.colors?.primary?.[100] || '#e0f2fe'};
    outline: none;
  }
  
  &:disabled {
    background: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
    color: ${props => props.theme.colors?.text?.disabled || '#a1a1aa'};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors?.text?.disabled || '#a1a1aa'};
  }
`;

const TimerTips = styled.div`
  margin-top: ${props => props.theme.spacing?.(6) || '24px'};
  padding: ${props => props.theme.spacing?.(4) || '16px'};
  background: ${props => props.theme.colors?.primary?.[50] || '#f0f9ff'};
  border-radius: ${props => props.theme.borderRadius?.lg || '12px'};
  border-left: 4px solid ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'};
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  margin-bottom: ${props => props.theme.spacing?.(2) || '8px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
  color: ${props => props.theme.colors?.primary?.[800] || '#075985'};
`;

const TipText = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  color: ${props => props.theme.colors?.primary?.[700] || '#0369a1'};
  line-height: 1.6;
`;

const ProjectLabel = styled(Label)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
  margin-bottom: ${props => props.theme.spacing?.(2) || '8px'};
`;

const RequiredAsterisk = styled.span`
  color: ${props => props.theme.colors?.error?.[500] || '#ef4444'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing?.(8) || '32px'};
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  
  p {
    margin-bottom: ${props => props.theme.spacing?.(4) || '16px'};
  }
`;

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pauseTime, setPauseTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  
  const dispatch = useDispatch();
  const { items: projects = [], loading: projectsLoading } = useSelector(state => state.projects || {});
  const { user } = useSelector(state => state.auth || {});

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const handleStart = () => {
    if (!selectedProject) {
      alert('📋 Пожалуйста, выберите проект перед началом работы');
      return;
    }
    
    setStartTime(Date.now());
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isPaused) {
      const pauseDuration = Math.floor((Date.now() - pauseTime) / 1000);
      setPausedDuration(prev => prev + pauseDuration);
      setIsPaused(false);
    } else {
      setPauseTime(Date.now());
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (!isRunning) return;
    
    const totalDuration = duration;
    const entry = {
      userId: user?.id,
      projectId: selectedProject,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: totalDuration,
      pausedDuration: pausedDuration,
      description: description.trim() || 'Работа над проектом'
    };
    
    dispatch(saveTimeEntry(entry));
    resetTimer();
    
    alert(`✅ Время записано! Всего отработано: ${formatTime(totalDuration)}`);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setDuration(0);
    setPausedDuration(0);
    setDescription('');
    setSelectedProject('');
    setStartTime(null);
    setPauseTime(null);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    if (isPaused) return '⏸️';
    if (isRunning) return '⏱️';
    return '⏰';
  };

  const getStatusText = () => {
    if (isPaused) return 'На паузе';
    if (isRunning) return 'Идет отсчет';
    return 'Готов к работе';
  };

  const progress = (duration % 3600) / 3600 * 283;

  if (projectsLoading) {
    return (
      <TimerContainer>
        <EmptyState>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
          <p>Загрузка проектов...</p>
        </EmptyState>
      </TimerContainer>
    );
  }

  if (projects.length === 0) {
    return (
      <TimerContainer>
        <EmptyState>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📁</div>
          <h3>Нет проектов</h3>
          <p>Создайте свой первый проект, чтобы начать отслеживать время</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/projects'}
            style={{ marginTop: '16px' }}
          >
            📝 Создать проект
          </Button>
        </EmptyState>
      </TimerContainer>
    );
  }

  return (
    <TimerContainer>
      <TimerHeader>
        <TimeDisplay>
          <TimerVisual>
            <TimerCircle viewBox="0 0 100 100">
              <TimerBackground cx="50" cy="50" r="45" />
              <TimerProgress
                cx="50"
                cy="50"
                r="45"
                strokeDasharray="283"
                strokeDashoffset={283 - progress}
                $isRunning={isRunning && !isPaused}
              />
            </TimerCircle>
            <TimerContent>
              <TimeText $isRunning={isRunning && !isPaused} $isPaused={isPaused}>
                {formatTime(duration)}
              </TimeText>
              <StatusBadge $isRunning={isRunning && !isPaused} $isPaused={isPaused}>
                {getStatusIcon()} {getStatusText()}
              </StatusBadge>
            </TimerContent>
          </TimerVisual>
        </TimeDisplay>

        <Controls>
          {!isRunning ? (
            <ControlButton
              variant="primary"
              onClick={handleStart}
              disabled={!selectedProject}
              title="Начать отсчет времени"
            >
              ▶️
              <ButtonText>Старт</ButtonText>
            </ControlButton>
          ) : (
            <>
              <ControlButton
                variant={isPaused ? "primary" : "secondary"}
                onClick={handlePause}
                title={isPaused ? "Продолжить работу" : "Поставить на паузу"}
              >
                {isPaused ? '▶️' : '⏸️'}
                <ButtonText>{isPaused ? 'Продолжить' : 'Пауза'}</ButtonText>
              </ControlButton>
              <ControlButton
                variant="success"
                onClick={handleStop}
                title="Завершить и сохранить время"
              >
                ⏹️
                <ButtonText>Стоп</ButtonText>
              </ControlButton>
            </>
          )}
        </Controls>
      </TimerHeader>
      
      <FormGrid>
        <FormControl>
          <ProjectLabel>
            📁 Проект <RequiredAsterisk>*</RequiredAsterisk>
          </ProjectLabel>
          <ProjectSelect
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            disabled={isRunning}
          >
            <option value="">Выберите проект...</option>
            {projects.map(project => (
              <option key={project.id || project._id} value={project.id || project._id}>
                {project.name}
              </option>
            ))}
          </ProjectSelect>
        </FormControl>
        
        <FormControl>
          <Label>
            📝 Описание работы
          </Label>
          <DescriptionTextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isRunning}
            placeholder="Опишите, чем вы занимались (необязательно)..."
            rows={4}
          />
        </FormControl>
      </FormGrid>

      <TimerTips>
        <TipHeader>
          💡 Совет
        </TipHeader>
        <TipText>
          Используйте технику Pomodoro: 25 минут работы → 5 минут отдыха. 
          Это повышает продуктивность и предотвращает выгорание.
        </TipText>
      </TimerTips>
    </TimerContainer>
  );
}