import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LamaModule } from './lama/lama.module';
import { ElevenlabsModule } from './elevenlabs/elevenlabs.module';

@Module({
  imports: 
  [MongooseModule.forRoot('mongodb://localhost/rfid-auth'),
    AuthModule,
    LamaModule,
    ElevenlabsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
