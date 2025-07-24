import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@common/database/entities';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  // This method is used to get all users
  async findAll() {
    return this.usersRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });
  }

  // This method is used to a get user by ID
  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  // This method is used to update a user by ID
  async update(id: string, updateData: UpdateUserDto) {
    await this.findOne(id);
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  // This method is used to remove a user by ID
  async remove(id: string) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { deleted: true };
  }
}
