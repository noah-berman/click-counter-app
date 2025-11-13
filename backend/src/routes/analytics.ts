import express from 'express';
import { clickService } from '../services/click.service';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/user', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const totalClicks = await clickService.getUserClickCount(userId);
    
    // Get clicks from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const clicksToday = await clickService.getUserClicksByDateRange(
      userId,
      today,
      tomorrow
    );

    // Calculate average clicks per day
    const userClicks = await clickService.getUserClicks(userId);
    let averagePerDay = 0;
    if (userClicks.length > 0) {
      const firstClick = userClicks[userClicks.length - 1].timestamp;
      const daysSinceFirstClick = Math.max(
        1,
        Math.floor((Date.now() - firstClick.getTime()) / (1000 * 60 * 60 * 24))
      );
      averagePerDay = totalClicks / daysSinceFirstClick;
    }

    res.json({
      totalClicks,
      clicksToday: clicksToday.length,
      averagePerDay: Math.round(averagePerDay * 100) / 100,
      clicks: userClicks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user analytics' });
  }
});

router.get('/global', async (req: AuthRequest, res) => {
  try {
    const totalClicks = await clickService.getTotalClicks();
    const topUsers = await clickService.getTopUsers(10);

    res.json({
      totalClicks,
      topUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get global analytics' });
  }
});

router.get('/clicks-per-day', async (req: AuthRequest, res) => {
  try {
    // Get date range from query params (days parameter)
    const days = parseInt(req.query.days as string) || 30;
    
    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of today
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0); // Start of the day

    const clicksPerDay = await clickService.getClicksPerDay(startDate, endDate);

    res.json({
      clicksPerDay,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get clicks per day' });
  }
});

export default router;

