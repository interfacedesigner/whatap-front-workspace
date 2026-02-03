import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { describe, expect, it } from 'vitest';

import { ServerInventoryMapPage } from './ServerInventoryMapPage';

function renderWithProvider(ui: React.ReactElement) {
  return render(<Provider>{ui}</Provider>);
}

describe('ServerInventoryMapPage', () => {
  it('renders page title', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    expect(screen.getByText('Server Inventory Map')).toBeInTheDocument();
  });

  it('renders page description', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    expect(screen.getByText('서버 상태를 한눈에 파악하세요')).toBeInTheDocument();
  });

  it('renders server list section', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    expect(screen.getByText('서버 목록')).toBeInTheDocument();
  });

  it('renders server count', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    // Mock data generates 50 servers
    expect(screen.getByText(/총 \d+대/)).toBeInTheDocument();
  });

  it('renders project summary section', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    // ProjectSummary shows Total, Active labels (multiple Active/Cores elements exist in OS breakdown)
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cores?/i).length).toBeGreaterThan(0);
  });

  it('renders group selectors', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    expect(screen.getByText('1차 그룹')).toBeInTheDocument();
    expect(screen.getByText('2차 그룹')).toBeInTheDocument();
  });

  it('renders label selector', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    expect(screen.getByText('라벨')).toBeInTheDocument();
  });

  it('renders server icons in grid', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    // ServerGrid should render server icons with img role
    const serverIcons = screen.getAllByRole('img');
    expect(serverIcons.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = renderWithProvider(<ServerInventoryMapPage className='custom-class' />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has accessible comboboxes for selectors', () => {
    renderWithProvider(<ServerInventoryMapPage />);

    // GroupSelector and LabelSelector use combobox role
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBe(3); // 1차 그룹, 2차 그룹, 라벨
  });
});
