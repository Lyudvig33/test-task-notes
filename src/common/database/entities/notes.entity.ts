import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../base';
import { ShareLinkEntity } from './shared-links.entity';
import { UsersEntity } from './users.entity';

@Entity('notes')
export class NoteEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => UsersEntity, (user) => user.notes, { onDelete: 'CASCADE' })
  @Index()
  user: UsersEntity;

  @OneToMany(() => ShareLinkEntity, (link) => link.note, { cascade: true })
  shareLinks: ShareLinkEntity[];
}
