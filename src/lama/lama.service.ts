import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { Request } from 'express'; // ✅ Correct import to get Multer's file type
import { Mutex } from 'async-mutex';
import fs from 'fs';
import * as path from 'path';

@Injectable()
export class LamaService {
  private ollamaUrl = 'http://localhost:11434/api/generate'; // Ollama local server
  private ollamaMutex = new Mutex();
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
  async processImage(prompt: string, imagePath: string): Promise<string> {
    if (!imagePath || typeof imagePath !== 'string') {
      console.error("❌ Invalid image path:", imagePath);
      throw new Error("Invalid image path.");
    }

    // ✅ Ensure `fs` is properly imported and used
    if (!fs.existsSync(imagePath)) {
      console.error("❌ File does not exist at path:", imagePath);
      throw new Error("File does not exist.");
    }

    console.log(`✅ Processing image: ${imagePath}`);

    try {
      // ✅ Send file path to Ollama
      const requestData = {
        model: "llama3.2-vision:latest",
        messages: [
          {
            role: "user",
            content: prompt,
            images: [imagePath] // ✅ Send file path, NOT Base64
          }
        ],
        stream: false
      };

      console.log("📤 Sending request to Ollama...");

      const response = await axios.post(this.ollamaUrl, requestData, {
        headers: { "Content-Type": "application/json" },
        maxBodyLength: Infinity,
        timeout: 60000,
      });

      console.log("✅ Ollama Response:", JSON.stringify(response.data, null, 2));

      if (!response.data?.response) {
        console.error("⚠️ Ollama returned an empty response.");
        throw new Error("Empty response from Ollama.");
      }

      return response.data.response;
    } catch (error) {
      console.error("❌ Ollama API Error:", error.message);
      throw new Error(`Ollama API Error: ${error.message}`);
    } finally {
      // ✅ Delete temporary image file safely
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


  /*async generateTextWithImage(prompt: string, image: string): Promise<string> {
    // ✅ Declare tempPath at the start so it's accessible everywhere
    const tempPath = join(__dirname, '..', 'temp_image.jpg'); 

    return this.ollamaMutex.runExclusive(async () => {
        try {
            // ✅ Decode Base64 to Binary and Save as Temporary File
            const imageBuffer = Buffer.from(image, 'base64');

            // 🔥 Write the image file
            fs.writeFileSync(tempPath, imageBuffer);
            console.log(`✅ Image saved at: ${tempPath}`);

            // ✅ Create API request payload
            const requestData = {
                model: "llama3.2-vision:latest",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                        images: [tempPath] // ✅ Send file path instead of Base64
                    }
                ],
                stream: false
            };

            console.log("📤 Sending request to Ollama...");

            const response = await axios.post(this.ollamaUrl, requestData, {
                headers: { "Content-Type": "application/json" },
                maxBodyLength: Infinity,
                timeout: 60000,
            });

            console.log("✅ Ollama API Full Response:", JSON.stringify(response.data, null, 2));

            if (!response.data?.response) {
                console.error("⚠️ Ollama returned an empty response.");
                throw new Error("Empty response from Ollama.");
            }

            return response.data.response;
        } catch (error) {
            console.error("❌ Ollama API Error:", error.message);
            throw new Error(`Ollama API Error: ${error.message}`);
        } finally {
            // ✅ Move tempPath outside so it exists in `finally`
            try {
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                    console.log("🧹 Temporary image file deleted.");
                }
            } catch (err) {
                console.warn("⚠️ Failed to delete temp image:", err.message);
            }
        }
    });
}
  */
}
