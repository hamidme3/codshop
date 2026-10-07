import postgres from 'postgres';

async function run() {
  const sql = postgres(process.env.DATABASE_URL!);
  await sql`DROP TABLE IF EXISTS "products" CASCADE`;
  console.log('Dropped table products');
  process.exit(0);
}
run();
