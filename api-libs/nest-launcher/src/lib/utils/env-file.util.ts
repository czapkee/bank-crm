import { existsSync } from 'fs';
import { dirname, join, parse } from 'path';
import { fileURLToPath } from 'url';

function collectEnvFiles(startDirectory: string, result: string[]): void {
  let current = startDirectory;

  while (true) {
    const candidate = join(current, '.env');

    if (existsSync(candidate) && !result.includes(candidate)) {
      result.push(candidate);
    }

    const parent = dirname(current);

    if (parent === current || current === parse(current).root) {
      return;
    }

    current = parent;
  }
}

export function getEnvFilePaths(): string[] {
  const result: string[] = [];

  collectEnvFiles(process.cwd(), result);
  collectEnvFiles(dirname(fileURLToPath(import.meta.url)), result);

  return result;
}
