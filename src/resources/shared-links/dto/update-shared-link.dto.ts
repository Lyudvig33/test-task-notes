import { PartialType } from '@nestjs/mapped-types';
import { CreateSharedLinkDto } from './create-shared-link.dto';

export class UpdateSharedLinkDto extends PartialType(CreateSharedLinkDto) {}
