import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../base';
import { NoteEntity } from './notes.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @ApiProperty()
  @Index()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => NoteEntity, (note) => note.user, { cascade: true })
  notes: NoteEntity[];

  @Exclude()
  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken?: string;
}
