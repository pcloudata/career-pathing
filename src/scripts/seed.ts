import { seedData } from '../utils/seedData';

async function main() {
  try {
    await seedData();
    console.log('Data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

main();
