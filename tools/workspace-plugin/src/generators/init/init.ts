import { formatFiles, type Tree, updateJson } from '@nx/devkit';
import { assertKebabCase, toDisplayName } from '../../utils/names.ts';
import { replaceInFile } from '../../utils/replace.ts';

export interface InitGeneratorSchema {
  name: string;
  description: string;
}

const STARTER_NAME = 'monorepo-starter';
const STARTER_SLUG = 'starter';

/**
 * Turns a fresh copy of the starter into a project (ADR 0012): removes what belongs to the starter
 * only, then names the project in the package, the docs, the local services and the web app.
 */
export async function initGenerator(tree: Tree, options: InitGeneratorSchema): Promise<void> {
  const name = options.name.trim();
  const description = options.description.trim();
  assertKebabCase(name, 'project name');
  if (!description) {
    throw new Error('The description is required.');
  }
  if (!tree.exists('starter')) {
    throw new Error('The starter/ folder is missing: this project is already initialized.');
  }

  const displayName = toDisplayName(name);
  // PostgreSQL database names: no dashes, they would need quoting everywhere.
  const database = name.replaceAll('-', '_');
  const starterVersion = readStarterVersion(tree);

  // Starter only: its ADRs, changelog, maintenance guide and the workflow that tests this generator.
  tree.delete('starter');
  tree.delete('.github/workflows/starter.yml');

  updateJson(tree, 'package.json', (json) => ({ ...json, name, description }));

  replaceInFile(tree, 'README.md', [
    [/^# .*$/m, `# ${name}`],
    [/^(# .*\n\n).*$/m, `$1${description}`],
    [/<!-- starter:start -->[\s\S]*?<!-- starter:end -->\n\n/, ''],
  ]);
  replaceInFile(tree, 'docs/architecture.md', [['v0.0.0', `v${starterVersion}`]]);

  replaceInFile(tree, 'docker-compose.yml', [
    [`name: ${STARTER_NAME}`, `name: ${name}`],
    [`\${POSTGRES_DB:-${STARTER_SLUG}}`, `\${POSTGRES_DB:-${database}}`],
  ]);
  replaceInFile(tree, '.env.example', [
    [`POSTGRES_DB=${STARTER_SLUG}`, `POSTGRES_DB=${database}`],
    [`:5432/${STARTER_SLUG}_e2e`, `:5432/${database}_e2e`],
    [`:5432/${STARTER_SLUG}\n`, `:5432/${database}\n`],
    [`/realms/${STARTER_SLUG}\n`, `/realms/${name}\n`],
    ['MAIL_FROM=Starter <', `MAIL_FROM=${displayName} <`],
  ]);
  replaceInFile(tree, 'docker/keycloak/realm.json', [
    [`"realm": "${STARTER_SLUG}"`, `"realm": "${name}"`],
    ['"displayName": "Starter"', `"displayName": "${displayName}"`],
    [`default-roles-${STARTER_SLUG}`, `default-roles-${name}`],
  ]);
  for (const locale of ['en', 'fr']) {
    replaceInFile(tree, `apps/web/src/i18n/locales/${locale}.ts`, [
      ["name: 'Starter'", `name: '${displayName.replaceAll("'", "\\'")}'`],
    ]);
  }

  // Local environment, ignored by git: the defaults of .env.example work as is.
  if (!tree.exists('.env')) {
    tree.write('.env', tree.read('.env.example', 'utf-8') ?? '');
  }

  await formatFiles(tree);
}

function readStarterVersion(tree: Tree): string {
  const json = JSON.parse(tree.read('package.json', 'utf-8') ?? '{}') as {
    starter?: { version?: string };
  };
  const version = json.starter?.version;
  if (!version) {
    throw new Error('package.json has no starter.version.');
  }
  return version;
}
