import { PartialType } from '@nestjs/mapped-types';
import { CreateElevenlabDto } from './create-elevenlab.dto';

export class UpdateElevenlabDto extends PartialType(CreateElevenlabDto) {}
