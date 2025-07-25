import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Redis from 'ioredis';
import { Repository } from 'typeorm';

import { NoteEntity, UsersEntity } from '@common/database/entities';
import { ERROR_MESSAGES } from '@common/error-messages';

import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NotesService {
  private CACHE_TTL_SECONDS = 60;

  constructor(
    @InjectRepository(NoteEntity) private notesRepo: Repository<NoteEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  async create(userId: string, body: CreateNoteDto): Promise<NoteEntity> {
    const user = await this.usersRepo.findOneByOrFail({ id: userId });

    const note = await this.notesRepo.save({
      ...body,
      user,
    });

    await this.redis.del(this.getUserNotesCacheKey(userId));
    return note;
  }

  async findAll(userId: string): Promise<NoteEntity[]> {
    const cacheKey = this.getUserNotesCacheKey(userId);

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const notes = await this.notesRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    await this.redis.set(
      cacheKey,
      JSON.stringify(notes),
      'EX',
      this.CACHE_TTL_SECONDS,
    );
    return notes;
  }

  async findOne(id: string, userId: string): Promise<NoteEntity> {
    const note = await this.notesRepo.findOne({
      where: { id, userId },
      relations: ['user'],
    });
    if (!note) throw new NotFoundException(ERROR_MESSAGES.NOTE_NOT_FOUND);
    return note;
  }

  async update(
    id: string,
    userId: string,
    body: UpdateNoteDto,
  ): Promise<NoteEntity> {
    const note = await this.findOne(id, userId);
    const updated = await this.notesRepo.save({ ...note, ...body });

    await this.redis.del(this.getUserNotesCacheKey(userId));
    return updated;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const note = await this.findOne(id, userId);
    await this.notesRepo.remove(note);
    await this.redis.del(this.getUserNotesCacheKey(userId));
    return true;
  }

  private getUserNotesCacheKey(userId: string): string {
    return `user:${userId}:notes`;
  }
}
