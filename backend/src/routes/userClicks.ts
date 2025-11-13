import express from 'express';
import { clickService } from '../services/click.service';
import { authenticateSimpleToken } from '../middleware/simpleAuth';

const router = express.Router();

// All routes require simple token authentication
router.use(authenticateSimpleToken);

router.get('/clicks', async (req, res) => {
  try {
    const { email, date } = req.query;

    // Validate required parameters
    if (!email || !date) {
      return res.status(400).json({ 
        error: 'Both email and date parameters are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email as string)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Parse and validate date
    const dateObj = new Date(date as string);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format. Please use ISO 8601 format (e.g., YYYY-MM-DD)' 
      });
    }

    // Get click count for the user on the specified date
    const count = await clickService.getClicksByEmailAndDate(
      email as string,
      dateObj
    );

    res.json({ 
      email: email as string,
      date: date as string,
      clicks: count 
    });
  } catch (error) {
    console.error('Error fetching clicks:', error);
    res.status(500).json({ error: 'Failed to get click count' });
  }
});

export default router;
