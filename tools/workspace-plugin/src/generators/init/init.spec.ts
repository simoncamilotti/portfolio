import { type Tree, workspaceRoot } from '@nx/devkit';
import { createTree } from '@nx/devkit/testing';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { initGenerator } from './init.ts';

// The real starter files: a change that breaks the generator fails here, not in a new project.
const FILES = [
  '.prettierrc',
  'package.json',
  'README.md',
  'docs/architecture.md',
  'docker-compose.yml',
  '.env.example',
  'docker/keycloak/realm.json',
  'apps/web/src/i18n/locales/en.ts',
  'apps/web/src/i18n/locales/fr.ts',
  'starter/README.md',
  '.github/workflows/starter.yml',
  '.github/workflows/main.yml',
];

function starterTree(): Tree {
  const tree = createTree();
  for (const file of FILES) {
    tree.write(file, readFileSync(join(workspaceRoot, file), 'utf-8'));
  }
  return tree;
}

const read = (tree: Tree, path: string) => tree.read(path, 'utf-8') ?? '';

// Runs in the starter only: once a project is initialized, starter/ is gone and so is the generator's purpose.
const inStarter = existsSync(join(workspaceRoot, 'starter'));

describe.runIf(inStarter)('init generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = starterTree();
    await initGenerator(tree, {
      name: 'solar-monitor',
      description: 'Suivi de la production solaire',
    });
  });

  it('removes what belongs to the starter only', () => {
    expect(tree.exists('starter')).toBe(false);
    expect(tree.exists('.github/workflows/starter.yml')).toBe(false);
    expect(tree.exists('.github/workflows/main.yml')).toBe(true);
    expect(read(tree, 'README.md')).not.toContain('starter:start');
  });

  it('names the package and keeps the starter version', () => {
    const json = JSON.parse(read(tree, 'package.json'));
    const starter = JSON.parse(readFileSync(join(workspaceRoot, 'package.json'), 'utf-8'));
    expect(json).toMatchObject({
      name: 'solar-monitor',
      description: 'Suivi de la production solaire',
      starter: { version: starter.starter.version },
    });
    expect(read(tree, 'docs/architecture.md')).toContain(
      `monorepo-starter/tree/v${starter.starter.version}/starter/adr`,
    );
  });

  it('titles the README', () => {
    expect(read(tree, 'README.md')).toMatch(/^# solar-monitor\n\nSuivi de la production solaire\n/);
  });

  it('names the local services and the realm', () => {
    expect(read(tree, 'docker-compose.yml')).toContain('name: solar-monitor');
    expect(read(tree, 'docker-compose.yml')).toContain('${POSTGRES_DB:-solar_monitor}');
    expect(read(tree, 'docker/keycloak/realm.json')).toContain('"realm": "solar-monitor"');
    expect(read(tree, 'apps/web/src/i18n/locales/fr.ts')).toContain("name: 'Solar Monitor'");
  });

  it('creates .env from .env.example', () => {
    const env = read(tree, '.env');
    expect(env).toBe(read(tree, '.env.example'));
    expect(env).toContain('POSTGRES_DB=solar_monitor');
    expect(env).toContain('DATABASE_URL=postgresql://app:app@localhost:5432/solar_monitor\n');
    expect(env).toContain('E2E_DATABASE_URL=postgresql://app:app@localhost:5432/solar_monitor_e2e');
    expect(env).toContain('OIDC_ISSUER_URL=http://localhost:8080/realms/solar-monitor');
    expect(env).toContain('MAIL_FROM=Solar Monitor <');
  });

  it('leaves no trace of the starter name in the local environment', () => {
    for (const file of [
      'docker-compose.yml',
      '.env.example',
      'docker/keycloak/realm.json',
      'apps/web/src/i18n/locales/en.ts',
      'apps/web/src/i18n/locales/fr.ts',
    ]) {
      expect(read(tree, file), file).not.toMatch(/starter/i);
    }
  });

  it('refuses to run twice', async () => {
    await expect(
      initGenerator(tree, { name: 'solar-monitor', description: 'Suivi' }),
    ).rejects.toThrow(/already initialized/);
  });

  it('rejects an invalid name', async () => {
    await expect(
      initGenerator(starterTree(), { name: 'Solar_Monitor', description: 'Suivi' }),
    ).rejects.toThrow(/Invalid project name/);
  });
});
