import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LamaService } from './lama.service';
import { Express } from 'express';


@Controller('lama')
export class LamaController {
  constructor(private readonly lamaService: LamaService) {}

  /**
   * 📝 API: Text-only prompt
   * 📌 POST /lama/generate-text
   */
  @Post('generate-text')
async generateText(@Body('prompt') prompt: string) {
  const result = await this.lamaService.generateText(prompt);
  return { result };  // ✅ Always return JSON!
}

  /**
   * 🖼️ API: Text + Image prompt
   * 📌 POST /lama/generate-text-with-image
   */
  async generateTextWithImage(
    @Body('prompt') prompt: string,
    @UploadedFile() file: any
  ) {
    return this.lamaService.generateTextWithImage(prompt, file);
  }
  
}
