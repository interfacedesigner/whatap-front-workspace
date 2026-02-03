import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Server } from '../model/server.types';
import { ServerIcon } from './ServerIcon';

const mockServer: Server = {
  oid: 1,
  hostname: 'web-prod-01',
  ip: '10.0.1.1',
  status: 'ok',
  osType: 'Linux',
  serverType: 'web',
  cores: 8,
  defaultGroup: 'production',
  cloudRegion: 'ap-northeast-2',
};

describe('ServerIcon', () => {
  it('renders server icon with hostname label by default', () => {
    render(<ServerIcon server={mockServer} />);

    expect(screen.getByText('web-prod-01')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /web-prod-01 - ok/i })).toBeInTheDocument();
  });

  it('renders IP label when labelOption is ip', () => {
    render(<ServerIcon server={mockServer} labelOption='ip' />);

    expect(screen.getByText('10.0.1.1')).toBeInTheDocument();
  });

  it('renders status label when labelOption is status', () => {
    render(<ServerIcon server={mockServer} labelOption='status' />);

    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('renders no label when labelOption is null', () => {
    render(<ServerIcon server={mockServer} labelOption={null} />);

    expect(screen.queryByText('web-prod-01')).not.toBeInTheDocument();
    expect(screen.queryByText('10.0.1.1')).not.toBeInTheDocument();
  });

  it('applies correct status color for ok status', () => {
    render(<ServerIcon server={{ ...mockServer, status: 'ok' }} />);

    const icon = screen.getByRole('img', { name: /ok/i });
    expect(icon).toHaveClass('bg-green-500');
  });

  it('applies correct status color for warning status', () => {
    render(<ServerIcon server={{ ...mockServer, status: 'warning' }} />);

    const icon = screen.getByRole('img', { name: /warning/i });
    expect(icon).toHaveClass('bg-yellow-500');
  });

  it('applies correct status color for critical status', () => {
    render(<ServerIcon server={{ ...mockServer, status: 'critical' }} />);

    const icon = screen.getByRole('img', { name: /critical/i });
    expect(icon).toHaveClass('bg-red-500');
  });

  it('applies correct status color for inactive status', () => {
    render(<ServerIcon server={{ ...mockServer, status: 'inactive' }} />);

    const icon = screen.getByRole('img', { name: /inactive/i });
    expect(icon).toHaveClass('bg-gray-400');
  });

  it('has tooltip trigger with proper aria label', () => {
    render(<ServerIcon server={mockServer} />);

    const trigger = screen.getByRole('img', { name: /web-prod-01/i });
    expect(trigger).toBeInTheDocument();
  });
});
