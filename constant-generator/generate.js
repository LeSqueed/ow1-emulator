import { DatabaseService } from './dist/services/database.js';
import { generateConstants } from './dist/services/generator.js';
import fs from 'fs';

async function main() {
  console.log('Initializing database...');
  const db = new DatabaseService({ path: './data/constants.json' });
  await db.initialize();
  
  console.log('Generating constants...');
  const result = await generateConstants(db, '1.0.0');
  
  console.log(`Generated ${result.files.length} files with ${result.constants} constants for ${result.heroes} heroes`);
  
  // Read and print the generated files
  for (const file of result.files) {
    console.log(`\nContents of ${file}:`);
    const content = fs.readFileSync(file, 'utf-8');
    console.log(content);
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});