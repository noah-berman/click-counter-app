import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// List of common first names
const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Sage', 'River', 'Skyler', 'Phoenix', 'Blake', 'Cameron', 'Dakota', 'Hayden',
  'Jamie', 'Kai', 'Logan', 'Noah', 'Olivia', 'Emma', 'Sophia', 'Isabella',
  'Charlotte', 'Amelia', 'Mia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth',
  'Mila', 'Ella', 'Avery', 'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria',
  'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey',
  'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie',
  'Stella', 'Natalie', 'Zoe', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah',
  'Audrey', 'Brooklyn', 'Bella', 'Claire', 'Skylar', 'Lucy', 'Paisley', 'Everly',
  'Anna', 'Caroline', 'Nova', 'Genesis', 'Aaliyah', 'Kennedy', 'Kinsley', 'Allison',
  'Maya', 'Sarah', 'Ariana', 'Allison', 'Gabriella', 'Alice', 'Madelyn', 'Cora',
  'Ruby', 'Eva', 'Serenity', 'Autumn', 'Adeline', 'Hailey', 'Gianna', 'Valentina',
  'Isla', 'Eliana', 'Quinn', 'Nevaeh', 'Ivy', 'Sadie', 'Piper', 'Lydia', 'Alexa',
  'Josephine', 'Emilia', 'Gracie', 'Vivian', 'Willow', 'Reagan', 'Brielle', 'Delilah'
];

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function main() {
  console.log('Starting database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.click.deleteMany();
  await prisma.user.deleteMany();

  const startDate = new Date('2025-10-01T00:00:00Z');
  const endDate = new Date();
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Generate 25 users with randomized first names
  const users = [];
  const passwordHash = await bcrypt.hash('password123', 10);
  
  // Shuffle and select 25 unique names
  const shuffledNames = shuffleArray(firstNames);
  const selectedNames = shuffledNames.slice(0, 25);

  for (let i = 0; i < 25; i++) {
    const name = selectedNames[i].toLowerCase();
    const email = `${name}@clickcounter.com`;
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        createdAt: new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
      }
    });
    users.push(user);
    console.log(`Created user ${i + 1}/25: ${email}`);
  }

  // Generate random clicks for each user
  for (const user of users) {
    // Random number of clicks per user (between 10 and 500)
    const numClicks = Math.floor(Math.random() * 490) + 10;
    
    const clicks = [];
    for (let i = 0; i < numClicks; i++) {
      // Random timestamp between startDate and endDate
      const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
      const timestamp = new Date(randomTime);
      
      clicks.push({
        userId: user.id,
        timestamp
      });
    }

    // Sort clicks by timestamp to make them chronological
    clicks.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Batch insert clicks (Prisma has a limit, so we'll do batches of 100)
    const batchSize = 100;
    for (let i = 0; i < clicks.length; i += batchSize) {
      const batch = clicks.slice(i, i + batchSize);
      await prisma.click.createMany({
        data: batch
      });
    }

    console.log(`Created ${numClicks} clicks for user ${user.email}`);
  }

  // Summary
  const totalUsers = await prisma.user.count();
  const totalClicks = await prisma.click.count();
  
  console.log('\n✅ Seed completed!');
  console.log(`Total users: ${totalUsers}`);
  console.log(`Total clicks: ${totalClicks}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

