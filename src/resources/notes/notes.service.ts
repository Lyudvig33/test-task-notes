import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { NoteEntity, UsersEntity } from '@common/database/entities';
import { ERROR_MESSAGES } from '@common/erorr-mesagges';

import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteEntity) private notesRepo: Repository<NoteEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
  ) {}

  async create(userId: string, body: CreateNoteDto): Promise<NoteEntity> {
    const user = await this.usersRepo.findOneByOrFail({ id: userId });

    return this.notesRepo.save({
      title: body.title,
      body: body.body,
      user,
    });
  }

  async findAll(userId: string): Promise<NoteEntity[]> {
    return this.notesRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
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
    return this.notesRepo.save({ ...note, ...body });
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const note = await this.findOne(id, userId);
    await this.notesRepo.remove(note);
    return true;
  }
}
