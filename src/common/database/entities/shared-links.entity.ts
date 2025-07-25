import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { NoteEntity } from './notes.entity';
import { BaseEntity } from '../base';

@Entity('share_links')
export class ShareLinkEntity extends BaseEntity {
  @Column({ name: 'token_hash' })
  @Index({ unique: true })
  tokenHash: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ default: false, name: 'is_used' })
  isUsed: boolean;

  @ManyToOne(() => NoteEntity, (note) => note.shareLinks, {
    onDelete: 'CASCADE',
  })
  note: NoteEntity;
}
