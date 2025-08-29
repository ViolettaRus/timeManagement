import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography?.fontFamily || 'Inter, sans-serif'};
    font-size: ${({ theme }) => theme.typography?.fontSize?.base || '16px'};
    font-weight: ${({ theme }) => theme.typography?.fontWeight?.normal || '400'};
    line-height: ${({ theme }) => theme.typography?.lineHeight?.normal || '1.5'};
    color: ${({ theme }) => theme.colors?.text?.primary || '#18181b'};
    background-color: ${({ theme }) => theme.colors?.background?.default || '#ffffff'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold || '600'};
    line-height: ${({ theme }) => theme.typography?.lineHeight?.tight || '1.25'};
    margin-bottom: ${({ theme }) => theme.spacing?.(2) || '8px'};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography?.fontSize?.['3xl'] || '30px'};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography?.fontSize?.['2xl'] || '24px'};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography?.fontSize?.xl || '20px'};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing?.(3) || '12px'};
    line-height: ${({ theme }) => theme.typography?.lineHeight?.relaxed || '1.75'};
  }

  a {
    color: ${({ theme }) => theme.colors?.primary?.[600] || '#0284c7'};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors?.primary?.[700] || '#0369a1'};
    }
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    transition: all 0.2s ease;
  }

  /* Улучшенный скроллбар */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors?.gray?.[100] || '#f4f4f5'};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors?.gray?.[300] || '#d4d4d8'};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors?.gray?.[400] || '#a1a1aa'};
    }
  }

  /* Убрать стандартные стили для details/summary */
  details summary {
    list-style: none;
    cursor: pointer;
  }

  details summary::-webkit-details-marker {
    display: none;
  }
`;