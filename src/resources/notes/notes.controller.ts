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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserGuard } from '@common/guards';
import { NoteResponseDto } from './dto/note-response.dto';
import { AuthUser } from '@common/decorators';
import { ITokenPayload } from '@common/models';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(AuthUserGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ type: NoteResponseDto, status: 201 })
  create(@Body() dto: CreateNoteDto, @AuthUser() user: ITokenPayload) {
    return this.notesService.create(user.id, dto);
  }

  @Get()
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
    @Body() dto: UpdateNoteDto,
    @AuthUser() user: ITokenPayload,
  ) {
    return this.notesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @AuthUser() user: ITokenPayload) {
    return this.notesService.remove(id, user.id);
  }
}
