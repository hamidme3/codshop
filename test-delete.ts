import { getDb, schema } from './src/db';
import { eq } from 'drizzle-orm';
import { deleteProduct } from './src/lib/db-repository';

async function main() {
  const db = getDb();
  if (!db) throw new Error("No db");
  try {
    const res = await deleteProduct("SKU-8749");
    console.log("Delete result:", res);
  } catch (err) {
    console.error("Caught error:", err);
  }
}
main();
