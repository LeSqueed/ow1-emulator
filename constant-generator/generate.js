import { DatabaseService } from './dist/services/database.js';
import { generateConstants } from './dist/services/generator.js';

async function main() {
  console.log('Initializing database...');
  const db = new DatabaseService({ path: './data/constants.json' });
  await db.initialize();
  
  console.log('Generating constants...');
  const result = await generateConstants(db, '1.0.0');
  
  console.log(`Generated ${result.files.length} files: ${result.files.join(', ')}`);
  console.log(`${result.constants} constants, ${result.heroes} heroes`);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});