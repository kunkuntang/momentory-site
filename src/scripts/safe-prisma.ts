import 'dotenv/config';
import { spawnSync } from 'child_process';

const DANGEROUS_COMMANDS = [
  'migrate dev',
  'migrate reset',
  'db push',
  'db seed',
  'studio',
];

const PRODUCTION_ENVS = ['production', 'prod'];
const PRODUCTION_APP_ENVS = ['PROD', 'PRODUCTION'];

function isProduction(): boolean {
  const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
  const appEnv = (process.env.APP_ENV || '').toUpperCase();
  return PRODUCTION_ENVS.includes(nodeEnv) || PRODUCTION_APP_ENVS.includes(appEnv);
}

function isDangerousCommand(args: string[]): boolean {
  const commandStr = args.join(' ').toLowerCase();
  return DANGEROUS_COMMANDS.some((dangerous) => commandStr.startsWith(dangerous));
}

function getPrismaBin(): string {
  return require.resolve('prisma/build/index.js');
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: safe-prisma <prisma-command> [args...]');
  process.exit(1);
}

if (isProduction() && isDangerousCommand(args)) {
  console.error('========================================');
  console.error('  ERROR: Dangerous Prisma command blocked!');
  console.error('========================================');
  console.error('');
  console.error(`Command: prisma ${args.join(' ')}`);
  console.error('');
  console.error('This command is blocked in production environment because:');
  console.error('  - It can modify database schema structure');
  console.error('  - It may cause data loss or table recreation');
  console.error('  - It could break production data integrity');
  console.error('');
  console.error('Current environment detection:');
  console.error(`  - NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
  console.error(`  - APP_ENV:  ${process.env.APP_ENV || '(not set)'}`);
  console.error('');
  console.error('For production, use the following safe procedures:');
  console.error('  1. Run migrations: prisma migrate deploy');
  console.error('  2. Generate client: prisma generate');
  console.error('  3. Validate schema: prisma validate');
  console.error('');
  console.error('If you really need to run this command (emergency only),');
  console.error('temporarily unset NODE_ENV/APP_ENV and re-run.');
  console.error('========================================');
  process.exit(1);
}

const prismaBin = getPrismaBin();
const result = spawnSync('node', [prismaBin, ...args], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 0);
