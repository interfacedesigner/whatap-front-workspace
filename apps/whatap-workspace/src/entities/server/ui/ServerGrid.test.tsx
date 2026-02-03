import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Server } from '../model/server.types';
import { ServerGrid } from './ServerGrid';

const mockServers: Server[] = [
  {
    oid: 1,
    hostname: 'web-prod-01',
    ip: '10.0.1.1',
    status: 'ok',
    osType: 'Linux',
    serverType: 'web',
    cores: 8,
  },
  {
    oid: 2,
    hostname: 'db-prod-01',
    ip: '10.0.1.2',
    status: 'warning',
    osType: 'Linux',
    serverType: 'db',
    cores: 16,
  },
  {
    oid: 3,
    hostname: 'app-prod-01',
    ip: '10.0.1.3',
    status: 'critical',
    osType: 'Windows',
    serverType: 'app',
    cores: 4,
  },
];

describe('ServerGrid', () => {
  it('renders all servers in the grid', () => {
    render(<ServerGrid servers={mockServers} />);

    expect(screen.getByText('web-prod-01')).toBeInTheDocument();
    expect(screen.getByText('db-prod-01')).toBeInTheDocument();
    expect(screen.getByText('app-prod-01')).toBeInTheDocument();
  });

  it('renders empty state when no servers', () => {
    render(<ServerGrid servers={[]} />);

    expect(screen.getByText('표시할 서버가 없습니다')).toBeInTheDocument();
  });

  it('renders server icons with IP labels when labelOption is ip', () => {
    render(<ServerGrid servers={mockServers} labelOption='ip' />);

    expect(screen.getByText('10.0.1.1')).toBeInTheDocument();
    expect(screen.getByText('10.0.1.2')).toBeInTheDocument();
    expect(screen.getByText('10.0.1.3')).toBeInTheDocument();
  });

  it('renders server icons with status labels when labelOption is status', () => {
    render(<ServerGrid servers={mockServers} labelOption='status' />);

    expect(screen.getByText('ok')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('renders server icons without labels when labelOption is null', () => {
    render(<ServerGrid servers={mockServers} labelOption={null} />);

    expect(screen.queryByText('web-prod-01')).not.toBeInTheDocument();
    expect(screen.queryByText('10.0.1.1')).not.toBeInTheDocument();
  });

  it('applies grid layout class', () => {
    const { container } = render(<ServerGrid servers={mockServers} />);

    const grid = container.firstChild;
    expect(grid).toHaveClass('grid');
  });

  it('applies custom className', () => {
    const { container } = render(<ServerGrid servers={mockServers} className='custom-class' />);

    const grid = container.firstChild;
    expect(grid).toHaveClass('custom-class');
  });
});
