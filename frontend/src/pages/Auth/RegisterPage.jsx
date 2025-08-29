import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';
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
  username: yup.string().required('Имя пользователя обязательно'),
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').required('Пароль обязателен'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
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

const RegisterPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data;
      const result = await dispatch(register(userData)).unwrap();
      
      if (result.status === 'success') {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err || 'Ошибка регистрации. Попробуйте другой email или имя пользователя.');
    }
  };

  return (
    <Container>
      <AuthContainer>
        <AuthCard>
          <AuthHeader>
            <AuthIcon>📝</AuthIcon>
            <AuthTitle>Создать аккаунт</AuthTitle>
          </AuthHeader>

          {error && (
            <ErrorText style={{ textAlign: 'center', marginBottom: '16px' }}>
              ⚠️ {error}
            </ErrorText>
          )}

          <AuthForm onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Label htmlFor="username">👤 Имя пользователя</Label>
              <Input
                id="username"
                placeholder="Введите имя пользователя"
                {...formRegister('username')}
                disabled={isSubmitting}
              />
              {errors.username && <ErrorText>⚠️ {errors.username.message}</ErrorText>}
            </FormControl>

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
                placeholder="Введите пароль"
                {...formRegister('password')}
                disabled={isSubmitting}
              />
              {errors.password && <ErrorText>⚠️ {errors.password.message}</ErrorText>}
            </FormControl>

            <FormControl>
              <Label htmlFor="confirmPassword">🔒 Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                {...formRegister('confirmPassword')}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && <ErrorText>⚠️ {errors.confirmPassword.message}</ErrorText>}
            </FormControl>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              style={{ marginTop: '8px' }}
            >
              {isSubmitting ? '⏳ Регистрация...' : '🚀 Зарегистрироваться'}
            </Button>
          </AuthForm>

          <AuthFooter>
            <p style={{ margin: 0, color: '#52525b' }}>
              Уже есть аккаунт?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#0ea5e9', 
                  fontWeight: '500',
                  textDecoration: 'underline' 
                }}
              >
                Войти
              </Link>
            </p>
          </AuthFooter>
        </AuthCard>
      </AuthContainer>
    </Container>
  );
};

export default RegisterPage;