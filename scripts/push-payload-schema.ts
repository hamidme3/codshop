import rawConfig from '../src/payload.config';
import { getPayload } from 'payload';

async function main() {
  const config = await ((rawConfig as any).default || rawConfig);
  const payload = await getPayload({ config });
  const adapter = payload.db as any;
  const { pushSchema } = adapter.requireDrizzleKit();

  console.log('[Schema] Pushing Payload CMS schema to PostgreSQL...');
  const res = await pushSchema(
    adapter.schema,
    adapter.drizzle,
    adapter.schemaName ? [adapter.schemaName] : undefined,
    adapter.tablesFilter
  );

  if (res.warnings?.length) {
    console.log('[Schema] Warnings:', res.warnings);
  }

  await res.apply();
  console.log('[Schema] Payload CMS schema synchronized successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Schema] Failed to push schema:', err);
  process.exit(1);
});
