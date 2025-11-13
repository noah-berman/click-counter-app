import express from 'express';
import { clickService } from '../services/click.service';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const click = await clickService.recordClick(req.userId!);
    res.status(201).json({ click });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record click' });
  }
});

router.get('/count', async (req: AuthRequest, res) => {
  try {
    const count = await clickService.getUserClickCount(req.userId!);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get click count' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const clicks = await clickService.getUserClicks(req.userId!);
    res.json({ clicks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get clicks' });
  }
});

export default router;

