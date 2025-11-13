import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import * as clickService from '../../services/clicks';

vi.mock('../../services/clicks');
vi.mock('../../components/NavBar', () => ({
  NavBar: () => <div>NavBar</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render click counter', async () => {
    vi.mocked(clickService.clickService.getClickCount).mockResolvedValue(5);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total Clicks: 5/)).toBeInTheDocument();
    });
  });

  it('should increment counter on button click', async () => {
    vi.mocked(clickService.clickService.getClickCount).mockResolvedValue(0);
    vi.mocked(clickService.clickService.recordClick).mockResolvedValue({
      click: {
        id: '1',
        userId: 'user1',
        timestamp: new Date().toISOString(),
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total Clicks: 0/)).toBeInTheDocument();
    });

    const button = screen.getByText('CLICK');
    fireEvent.click(button);

    await waitFor(() => {
      expect(clickService.clickService.recordClick).toHaveBeenCalledTimes(1);
    });
  });
});

