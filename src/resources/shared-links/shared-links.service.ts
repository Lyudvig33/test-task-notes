import { Injectable } from '@nestjs/common';
import { CreateSharedLinkDto } from './dto/create-shared-link.dto';
import { UpdateSharedLinkDto } from './dto/update-shared-link.dto';

@Injectable()
export class SharedLinksService {
  create(createSharedLinkDto: CreateSharedLinkDto) {
    return 'This action adds a new sharedLink';
  }

  findAll() {
    return `This action returns all sharedLinks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sharedLink`;
  }

  update(id: number, updateSharedLinkDto: UpdateSharedLinkDto) {
    return `This action updates a #${id} sharedLink`;
  }

  remove(id: number) {
    return `This action removes a #${id} sharedLink`;
  }
}
