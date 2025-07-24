import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity, UsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteEntity) private notesRepo: Repository<NoteEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
  ) {}

  async create(userId: string, dto: CreateNoteDto): Promise<NoteEntity> {
    const user = await this.usersRepo.findOneByOrFail({ id: userId });

    const note = this.notesRepo.create({
      title: dto.title,
      body: dto.body,
      user,
    });

    return this.notesRepo.save(note);
  }

  async findAll(userId: string): Promise<NoteEntity[]> {
    return this.notesRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<NoteEntity> {
    const note = await this.notesRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException('Access denied');
    return note;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateNoteDto,
  ): Promise<NoteEntity> {
    const note = await this.findOne(id, userId);
    Object.assign(note, dto);
    return this.notesRepo.save(dto);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const note = await this.findOne(id, userId);
    await this.notesRepo.remove(note);
    return true;
  }
}
