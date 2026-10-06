import { getDb, schema } from './src/db';
import { eq } from 'drizzle-orm';
async function main() {
  const db = getDb();
  if (!db) return console.log("No DB");
  const p = await db.query.products.findFirst({
    where: eq(schema.products.sku, 'sku-8234')
  });
  console.log("DB Product:", p ? p.title : "Not found");
  process.exit(0);
}
main();
