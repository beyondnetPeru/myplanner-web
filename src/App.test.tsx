import { render, screen } from '@testing-library/react';
import App from './App';

test('Render main app page correctly', () => {
  render(<App />);
  // Verifica que el header principal esté presente
  expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
  // Verifica que los botones principales estén presentes
  expect(screen.getByRole('button', { name: /Crear nuevo plan/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Descargar plan/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Marcar días libres/i })).toBeInTheDocument();
});
