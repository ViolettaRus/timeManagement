import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import {
  Container,
  Card,
  Form,
  FormControl,
  Label,
  Input,
  Button,
  ErrorText
} from '../../components/UI';
import styled from 'styled-components';

const schema = yup.object().shape({
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
});

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: ${props => props.theme.spacing?.(8) || '32px'} 0;
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: ${props => props.theme.spacing?.(8) || '32px'};
  text-align: center;
`;

const AuthHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing?.(6) || '24px'};
`;

const AuthIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing?.(3) || '12px'};
  color: ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'};
`;

const AuthTitle = styled.h1`
  font-size: ${props => props.theme.typography?.fontSize?.['2xl'] || '24px'};
  margin-bottom: ${props => props.theme.spacing?.(2) || '8px'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
`;

const AuthSubtitle = styled.p`
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  margin-bottom: ${props => props.theme.spacing?.(1) || '4px'};
`;

const AuthForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing?.(4) || '16px'};
`;

const AuthFooter = styled.div`
  margin-top: ${props => props.theme.spacing?.(6) || '24px'};
  padding-top: ${props => props.theme.spacing?.(4) || '16px'};
  border-top: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
`;

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      if (result.status === 'success') {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err || 'Ошибка входа. Проверьте данные и попробуйте снова.');
    }
  };

  return (
    <Container>
      <AuthContainer>
        <AuthCard>
          <AuthHeader>
            <AuthIcon>🔑</AuthIcon>
            <AuthTitle>Добро пожаловать</AuthTitle>
            <AuthSubtitle>Войдите в свой аккаунт</AuthSubtitle>
          </AuthHeader>

          {error && (
            <ErrorText style={{ textAlign: 'center', marginBottom: '16px' }}>
              ⚠️ {error}
            </ErrorText>
          )}

          <AuthForm onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Label htmlFor="email">📧 Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...formRegister('email')}
                disabled={isSubmitting}
              />
              {errors.email && <ErrorText>⚠️ {errors.email.message}</ErrorText>}
            </FormControl>

            <FormControl>
              <Label htmlFor="password">🔒 Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите ваш пароль"
                {...formRegister('password')}
                disabled={isSubmitting}
              />
              {errors.password && <ErrorText>⚠️ {errors.password.message}</ErrorText>}
            </FormControl>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              style={{ marginTop: '8px' }}
            >
              {isSubmitting ? '⏳ Вход...' : '🚀 Войти'}
            </Button>
          </AuthForm>

          <AuthFooter>
            <p style={{ margin: 0, color: '#52525b' }}>
              Еще нет аккаунта?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: '#0ea5e9', 
                  fontWeight: '500',
                  textDecoration: 'underline' 
                }}
              >
                Зарегистрироваться
              </Link>
            </p>
          </AuthFooter>
        </AuthCard>
      </AuthContainer>
    </Container>
  );
};

export default LoginPage;