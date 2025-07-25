import * as bcrypt from 'bcrypt';

import { datasource } from 'ormconfig';

import { UsersEntity } from '../entities';

const seed = async () => {
  await datasource.initialize();

  const userRepo = datasource.getRepository(UsersEntity);

  const password = await bcrypt.hash('qwerty123', 10);

  const user = userRepo.create({
    email: 'demo@user.com',
    password,
  });

  await userRepo.save(user);

  console.log('✅ Demo user created: demo@user.com / qwerty123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
