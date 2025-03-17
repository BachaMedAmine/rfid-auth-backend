import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LamaService } from './lama.service';
import type { Express } from 'express';  // ✅ Correctly import Express types
import { Mutex } from 'async-mutex';
import * as path from 'path';
import * as fs from 'fs';
import * as multer from 'multer';
const { diskStorage } = multer;


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
  @Post('generate-text-with-image')
  @UseInterceptors(FileInterceptor('image'))
  async generateTextWithImage(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const { prompt } = body;

    console.log(`📥 Received Prompt: ${prompt}`);
    console.log(`📷 Received Image: ${file?.originalname}, Size: ${file?.size} bytes`);

    if (!file || file.size < 500 || !file.path) {
        console.error('⚠️ Invalid or corrupted image file.');
        return { error: 'Invalid image file or missing path.' };
    }

    const imagePath = path.resolve(file.path);

    // ✅ Ensure file exists before passing it to LamaService
    if (!fs.existsSync(imagePath)) {
        console.error("❌ Error: File does not exist:", imagePath);
        return { error: "File does not exist." };
    }

    console.log(`✅ Resolved Image Path: ${imagePath}`);

    try {
        const result = await this.lamaService.processImage(prompt, imagePath);

        if (!result || result.trim() === "") {
            console.error("⚠️ Ollama returned an empty response.");
            return { error: "AI did not return a valid result." };
        }

        console.log("✅ AI Result:", result);
        return { result };
    } catch (error) {
        console.error('❌ Error generating text:', error.message);
        return { error: 'Failed to generate text from image.' };
    } finally {
        try {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log("🧹 Temporary image file deleted.");
            }
        } catch (err) {
            console.warn("⚠️ Failed to delete temp image:", err.message);
        }
    }
  }
}
