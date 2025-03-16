import { Module } from '@nestjs/common';
import { LamaService } from './lama.service';
import { LamaController } from './lama.controller';

@Module({
  controllers: [LamaController],
  providers: [LamaService],
})
export class LamaModule {}
