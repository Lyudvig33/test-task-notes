import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SharedLinksService } from './shared-links.service';
import { CreateSharedLinkDto } from './dto/create-shared-link.dto';
import { UpdateSharedLinkDto } from './dto/update-shared-link.dto';

@Controller('shared-links')
export class SharedLinksController {
  constructor(private readonly sharedLinksService: SharedLinksService) {}

  @Post()
  create(@Body() createSharedLinkDto: CreateSharedLinkDto) {
    return this.sharedLinksService.create(createSharedLinkDto);
  }

  @Get()
  findAll() {
    return this.sharedLinksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sharedLinksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSharedLinkDto: UpdateSharedLinkDto) {
    return this.sharedLinksService.update(+id, updateSharedLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sharedLinksService.remove(+id);
  }
}
