import React from 'react';
import styled from 'styled-components';

const colors = [
  { value: '#3b82f6', label: 'Синий' },
  { value: '#ef4444', label: 'Красный' },
  { value: '#10b981', label: 'Зеленый' },
  { value: '#f59e0b', label: 'Желтый' },
  { value: '#8b5cf6', label: 'Фиолетовый' },
];

const FormControl = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ColorCircle = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
  border-radius: 50%;
`;

const ColorPicker = ({ value, onChange }) => {
  return (
    <FormControl>
      <Label>Цвет</Label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {colors.map((color) => (
          <option key={color.value} value={color.value}>
            <OptionContainer>
              <ColorCircle color={color.value} />
              {color.label}
            </OptionContainer>
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default ColorPicker;