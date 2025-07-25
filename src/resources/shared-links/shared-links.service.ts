import {
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { randomUUID } from 'crypto';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { NoteEntity, ShareLinkEntity } from '@common/database/entities';
import { ERROR_MESSAGES } from '@common/erorr-mesagges';

import { CreateSharedLinkDto } from './dto';

@Injectable()
export class SharedLinksService {
  constructor(
    @InjectRepository(ShareLinkEntity)
    private sharedLinkRepo: Repository<ShareLinkEntity>,

    @InjectRepository(NoteEntity)
    private noteRepo: Repository<NoteEntity>,
  ) {}
  async create(noteId: string, userId: string, body: CreateSharedLinkDto) {
    const note = await this.noteRepo.findOne({
      where: { id: noteId },
      relations: ['user'],
    });
    if (!note || note.user.id !== userId) throw new ForbiddenException();

    const token = randomUUID();
    const tokenHash = await bcrypt.hash(token, 10);

    const expiresAt = new Date(Date.now() + body.ttlMinutes * 60 * 1000);

    await this.sharedLinkRepo.save({
      tokenHash,
      expiresAt,
      isUsed: false,
      note,
    });

    return { token };
  }

  async findPublic(token: string) {
    const shareLink = await this.sharedLinkRepo.find({ relations: ['note'] });

    for (const link of shareLink) {
      const match = await bcrypt.compare(token, link.tokenHash);
      if (match) {
        if (link.isUsed)
          throw new GoneException(ERROR_MESSAGES.SAHRED_LINK_ALREADY_USED);
        if (link.expiresAt < new Date())
          throw new GoneException(ERROR_MESSAGES.SHARED_LINK_EXPIRED);

        link.isUsed = true;
        await this.sharedLinkRepo.save(link);
        return link.note;
      }
    }
    throw new NotFoundException(ERROR_MESSAGES.INVALID_SHARED_LINK);
  }

  async list(noteId: string, userId: string) {
    const note = await this.noteRepo.findOne({
      where: { id: noteId },
      relations: ['user'],
    });
    if (!note || note.user.id !== userId)
      throw new ForbiddenException(ERROR_MESSAGES.NOTE_NOT_FOUND);
    return this.sharedLinkRepo.find({ where: { note } });
  }

  async revoke(noteId: string, tokenId: string, userId: string) {
    const link = await this.sharedLinkRepo.findOne({
      where: { id: tokenId },
      relations: ['note', 'note.user'],
    });

    if (!link || link.note.id !== noteId || link.note.user.id !== userId)
      throw new ForbiddenException(ERROR_MESSAGES.NOTE_NOT_FOUND);

    link.isUsed = true;
    await this.sharedLinkRepo.save(link);
  }
}
