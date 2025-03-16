import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { ElevenLabsService } from './elevenlabs.service';
import { Response } from 'express';

@Controller('elevenlabs')
export class ElevenLabsController {
  constructor(private readonly elevenLabsService: ElevenLabsService) {}

  @Get('voices')
  async getVoices() {
    return this.elevenLabsService.getVoices();
  }

  @Post('synthesize')
  async synthesizeSpeech(
    @Body() body: { text: string; voiceId: string },
    @Res() res: Response,
  ) {
    const { text, voiceId } = body;
    try {
      const audioBuffer = await this.elevenLabsService.synthesizeSpeech(text, voiceId);
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="output.mp3"',
      });
      res.send(audioBuffer);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}
