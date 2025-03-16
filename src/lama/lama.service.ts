import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Express } from 'express';  // ✅ Import Express to recognize Multer.File

@Injectable()
export class LamaService {
  private ollamaUrl = 'http://localhost:11434/api/generate'; // Ollama local server

  /**
   * 📝 Process text-only prompts
   */
  async generateText(prompt: string): Promise<string> {
    console.log(prompt);
    try {
      const response = await axios.post(this.ollamaUrl, {
        model: 'llama3.2-vision',  // Adjust to 'llama3.2' if needed
        prompt: prompt,
        stream: false
      });

      return response.data.response;
    } catch (error) {
      throw new Error(`Ollama API Error: ${error.message}`);
    }
  }

  /**
   * 🖼️ Process text + image prompts
   */
  async generateTextWithImage(prompt: string, file: any): Promise<string> {
    try {
      if (!file) {
        throw new Error('No image file uploaded.');
      }

      // Convert image to Base64
      const base64Image = file.buffer.toString('base64');

      // Send request to Ollama API
      const response = await axios.post(this.ollamaUrl, {
        model: 'llama3.2-vision',  // Adjust to 'llama3.2' if needed
        prompt: prompt,
        image: base64Image,
        stream: false
      });

      return response.data.response;
    } catch (error) {
      throw new Error(`Ollama API Error: ${error.message}`);
    }
  }
}
