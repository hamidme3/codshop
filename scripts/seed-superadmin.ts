import { getPayload } from 'payload';
import config from '../src/payload.config';

async function seedSuperadmin() {
  console.log('🚀 Initializing Payload Superadmin Provisioner...');
  const payload = await getPayload({ config });

  const email = (process.env.SUPERADMIN_EMAIL || 'admin@codshop.vipone.site').toLowerCase().trim();
  const password = process.env.SUPERADMIN_PASSWORD || 'CodShopSuperAdmin2026!';
  const name = process.env.SUPERADMIN_NAME || 'CODShop Superadmin';

  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
    limit: 1,
  });

  if (existingUsers.docs.length > 0) {
    const user = existingUsers.docs[0];
    console.log(`ℹ️ User ${email} already exists (ID: ${user.id}).`);
    if (user.role !== 'superadmin') {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          role: 'superadmin',
        },
      });
      console.log(`✅ Updated ${email} role to 'superadmin'.`);
    } else {
      console.log(`✅ ${email} is already verified as 'superadmin'.`);
    }
  } else {
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name,
        role: 'superadmin',
      },
    });
    console.log(`🎉 Successfully created Superadmin user: ${email} (ID: ${newUser.id})`);
  }

  process.exit(0);
}

seedSuperadmin().catch((err) => {
  console.error('❌ Failed to seed Superadmin:', err);
  process.exit(1);
});
