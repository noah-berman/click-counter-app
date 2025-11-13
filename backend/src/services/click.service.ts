import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const clickService = {
  async recordClick(userId: string) {
    const click = await prisma.click.create({
      data: {
        userId
      }
    });

    return click;
  },

  async getUserClickCount(userId: string): Promise<number> {
    const count = await prisma.click.count({
      where: { userId }
    });

    return count;
  },

  async getUserClicks(userId: string) {
    const clicks = await prisma.click.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });

    return clicks;
  },

  async getTotalClicks(): Promise<number> {
    const count = await prisma.click.count();
    return count;
  },

  async getUserClicksByDateRange(userId: string, startDate: Date, endDate: Date) {
    const clicks = await prisma.click.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    return clicks;
  },

  async getTopUsers(limit: number = 10) {
    const topUsers = await prisma.click.groupBy({
      by: ['userId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: limit
    });

    // Get user details for top users
    const userIds = topUsers.map(t => t.userId);
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        email: true
      }
    });

    return topUsers.map(t => ({
      user: users.find(u => u.id === t.userId),
      clickCount: t._count.id
    }));
  },

  async getClicksPerDay(startDate: Date, endDate: Date) {
    // Fetch all clicks in the date range
    const clicks = await prisma.click.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        timestamp: true
      }
    });

    // Group clicks by day
    const clicksByDay = new Map<string, number>();
    
    clicks.forEach(click => {
      // Format date as YYYY-MM-DD for grouping
      const dateKey = click.timestamp.toISOString().split('T')[0];
      clicksByDay.set(dateKey, (clicksByDay.get(dateKey) || 0) + 1);
    });

    // Convert to array and sort by date
    const result = Array.from(clicksByDay.entries())
      .map(([date, count]) => ({
        date,
        clicks: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  },

  async getClicksByEmailAndDate(email: string, date: Date): Promise<number> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return 0;
    }

    // Calculate start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Count clicks for the user on the specified date
    const count = await prisma.click.count({
      where: {
        userId: user.id,
        timestamp: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    return count;
  }
};

