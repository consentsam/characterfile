import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the character file path from command line arguments
const characterFilePath = process.argv[2];
if (!characterFilePath) {
  console.error('Usage: node validate.mjs <character-file-path>');
  process.exit(1);
}

// Read the JSON schema file using absolute path
const schemaPath = path.join(__dirname, '..', 'schema', 'character.schema.json');
const schemaJson = fs.readFileSync(schemaPath, 'utf-8');
const schema = JSON.parse(schemaJson);

// Read the character file to validate
const jsonString = fs.readFileSync(characterFilePath, 'utf-8');
const jsonData = JSON.parse(jsonString);

// Create an Ajv instance
const ajv = new Ajv();

// Compile the schema
const validate = ajv.compile(schema);

// Validate the JSON data against the schema
const valid = validate(jsonData);

if (valid) {
  console.log('JSON file is valid against the schema.');
  process.exit(0);
} else {
  console.log('JSON file is not valid against the schema.');
  console.log('Validation errors:', validate.errors);
  process.exit(1);
}