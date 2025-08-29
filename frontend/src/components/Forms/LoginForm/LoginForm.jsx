import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/slices/authSlice';
import { Button, Input } from '../../UI';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: ${({ theme }) => theme.spacing(4)};
  background: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows[2]};
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error.main};
  background-color: ${({ theme }) => theme.colors.error.light};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  border-left: 4px solid ${({ theme }) => theme.colors.error.main};
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dispatch(login(formData)).unwrap();
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <FormContainer>
      <FormTitle>Вход в систему</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        
        <Input
          label="Пароль"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </FormContainer>
  );
};

export default LoginForm;