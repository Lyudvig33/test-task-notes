import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1753478566726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO users (id, password, "created_at", "updated_at", email)
          VALUES (
            '38c21bdf-a415-4d62-bfe6-138933aa2e77',
            '$2b$10$xvkWbfoVQP6HihOkU7mBZupMOnvGWddRSVBp8WT2b6BIug9fRs7wG',
            '2025-07-25T13:04:03.154Z',
            '2025-07-25T13:04:14.052Z',
            'demo@gmail.com'
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM users
          WHERE id = '38c21bdf-a415-4d62-bfe6-138933aa2e77';
        `);
  }
}
