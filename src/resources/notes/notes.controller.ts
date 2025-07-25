import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '@common/decorators';
import { AuthUserGuard } from '@common/guards';
import { ITokenPayload } from '@common/models';

import { CreateNoteDto, NoteResponseDto, UpdateNoteDto } from './dto';
import { NotesService } from './notes.service';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(AuthUserGuard)
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ type: NoteResponseDto, status: 201 })
  create(@Body() body: CreateNoteDto, @AuthUser() user: ITokenPayload) {
    return this.notesService.create(user.id, body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user notes' })
  @ApiResponse({ type: [NoteResponseDto] })
  findAll(@AuthUser() user: ITokenPayload) {
    return this.notesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single note' })
  @ApiResponse({ type: NoteResponseDto })
  findOne(@Param('id') id: string, @AuthUser() user: ITokenPayload) {
    return this.notesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ type: NoteResponseDto })
  update(
    @Param('id') id: string,
    @Body() body: UpdateNoteDto,
    @AuthUser() user: ITokenPayload,
  ) {
    return this.notesService.update(id, user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string, @AuthUser() user: ITokenPayload) {
    return this.notesService.remove(id, user.id);
  }
}
