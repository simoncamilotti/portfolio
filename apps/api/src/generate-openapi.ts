/**
 * Writes the OpenAPI document without starting the server: `node dist/generate-openapi.js <file>`.
 * Consumed by orval to generate `@repo/api-client`.
 */
import { writeFileSync } from 'node:fs';

// Placeholders only: the document does not depend on the runtime configuration.
process.env['NODE_ENV'] ||= 'production';
process.env['TZ'] ||= 'Etc/UTC';
process.env['DATABASE_URL'] ||= 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
process.env['OIDC_ISSUER_URL'] ||= 'http://localhost/placeholder';
process.env['OIDC_AUDIENCE'] ||= 'placeholder';
process.env['CORS_ORIGINS'] ||= 'http://localhost';
process.env['SMTP_HOST'] ||= 'localhost';
process.env['SMTP_FROM'] ||= 'placeholder@localhost';
process.env['CONTACT_EMAIL_TO'] ||= 'placeholder@localhost';
process.env['RECAPTCHA_SECRET_KEY'] ||= 'placeholder';

const { NestFactory } = await import('@nestjs/core');
const { AppModule } = await import('./app.module.js');
const { createOpenApiDocument } = await import('./openapi.js');

const output = process.argv[2] ?? 'openapi.json';
const app = await NestFactory.create(AppModule, { preview: true, logger: false });
app.setGlobalPrefix('api');
writeFileSync(output, `${JSON.stringify(createOpenApiDocument(app), null, 2)}\n`);
await app.close();
