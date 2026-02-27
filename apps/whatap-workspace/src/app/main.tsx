import { initializeTheme } from '@/shared/lib/theme';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

// Apply stored theme immediately to prevent FOUC (Flash of Unstyled Content)
initializeTheme();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
