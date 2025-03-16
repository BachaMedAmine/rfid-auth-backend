import { PartialType } from '@nestjs/mapped-types';
import { CreateLamaDto } from './create-lama.dto';

export class UpdateLamaDto extends PartialType(CreateLamaDto) {}
