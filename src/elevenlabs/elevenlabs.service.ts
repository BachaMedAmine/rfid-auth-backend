import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';


dotenv.config();

@Injectable()
export class ElevenLabsService {
  private readonly apiKey = process.env.ELEVENLABS_API_KEY;
  private readonly baseUrl = process.env.ELEVENLABS_API_BASE_URL;

  /**
   * Synthesizes speech from text using ElevenLabs API.
   * @param text The text to convert to speech.
   * @param voiceId The ID of the voice to use.
   * @returns A buffer containing the audio data.
   */
  async synthesizeSpeech(text: string, voiceId: string): Promise<Buffer> {
    console.log('d5alt lenna');
    try {
      const url = `${this.baseUrl}/text-to-speech/${voiceId}`;
      const response = await axios.post(
        url,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          responseType: 'arraybuffer', // Ensures the audio file is returned as a buffer
        },
      );
  
      return Buffer.from(response.data);
    } catch (error) {
      // Parse the error response for better debugging
      if (error.response?.data) {
        const errorDetails = error.response.data;
  
        // If it's a buffer, try to parse it
        if (Buffer.isBuffer(errorDetails)) {
          const errorString = errorDetails.toString('utf-8');
          console.error('Error synthesizing speech:', JSON.parse(errorString));
        } else {
          console.error('Error synthesizing speech:', errorDetails);
        }
      } else {
        console.error('Error synthesizing speech:', error.message);
      }
  
      throw new Error('Failed to synthesize speech');
    }
  }
  

  /**
   * Fetches available voices from the ElevenLabs API.
   * @returns A list of voices.
   */
  async getVoices(): Promise<any> {
    console.log('API Key:', this.apiKey);
    console.log('Base URL:', this.baseUrl);
    try {
      const url = `${this.baseUrl}/voices`;
      const response = await axios.get(url, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching voices:', error.response?.data || error.message);
      throw new Error('Failed to fetch voices');
    }
  }
}
