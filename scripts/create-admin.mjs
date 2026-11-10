import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import argon2 from 'argon2';
import dotenv from 'dotenv';
import pg from 'pg';

const scriptDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(scriptDir, '../.env'), quiet: true });

function readArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);

  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }

  return process.env[`ADMIN_${name.toUpperCase()}`] ?? fallback;
}

const email = readArg('email');
const password = readArg('password');
const name = readArg('name', 'Admin');
const surname = readArg('surname', 'Superadmin');
const phone = readArg('phone', '0000000000');

if (!email || !password) {
  console.error('Usage: npm run seed:admin -- --email admin@bank.local --password Admin12345');
  process.exit(1);
}

if (
  password.length < 8 ||
  !/[a-z]/.test(password) ||
  !/[A-Z]/.test(password) ||
  !/[0-9]/.test(password)
) {
  console.error('Password must contain at least 8 characters, one lowercase letter, one uppercase letter and one digit.');
  process.exit(1);
}

if (!process.env.USER_DB_URL) {
  console.error('USER_DB_URL is not set. Check your .env file.');
  process.exit(1);
}

const databaseUrl = new URL(process.env.USER_DB_URL);
databaseUrl.searchParams.delete('schema');

const client = new pg.Client({ connectionString: databaseUrl.toString() });
const passwordHash = await argon2.hash(password, {
  type: argon2.argon2id,
  timeCost: 3,
  memoryCost: 65536,
  parallelism: 4,
});

await client.connect();

try {
  const existing = await client.query('SELECT id FROM auth_employers WHERE email = $1', [email]);

  if (existing.rowCount > 0) {
    console.error(`Employee with email ${email} already exists.`);
    process.exit(1);
  }

  await client.query('BEGIN');

  const userId = randomUUID();
  const employeeId = randomUUID();

  await client.query(
    `INSERT INTO users
      (id, name, surname, phone_number, is_resident, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, $4, true, true, now(), now())`,
    [userId, name, surname, phone],
  );

  await client.query(
    `INSERT INTO auth_employers
      (id, email, password_hash, "userId", role, registration_expires_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'SUPERADMIN', NULL, now(), now())`,
    [employeeId, email, passwordHash, userId],
  );

  await client.query('COMMIT');

  console.log('SUPERADMIN created successfully.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
} catch (error) {
  await client.query('ROLLBACK');
  console.error(error);
  process.exit(1);
} finally {
  await client.end();
}
