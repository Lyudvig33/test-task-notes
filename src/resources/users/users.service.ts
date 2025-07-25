import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UsersEntity } from '@common/database/entities';
import { ERROR_MESSAGES } from '@common/error-messages';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  /**
   * Retrieves all users sorted by creation date.
   */

  async findAll(): Promise<UserResponseDto[]> {
    return this.usersRepo.find({
      order: {
        createdAt: 'ASC',
      },
    });
  }

  /**
   * Retrieves a user by ID.
   * @throws NotFoundException if user is not found.
   */

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND_MESSAGE);
    }
    return user;
  }

  /**
   * Updates a user by ID.
   * @throws NotFoundException if user is not found.
   */
  async update(id: string, body: UpdateUserDto): Promise<UpdateUserDto> {
    const user = await this.findOne(id);
    Object.assign(user, body);
    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.delete(user);
  }
}
