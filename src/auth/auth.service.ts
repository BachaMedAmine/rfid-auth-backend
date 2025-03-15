import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(rfidKey: string): Promise<User> {
    const existingUser = await this.userModel.findOne({ rfidKey });
    if (existingUser) {
      throw new Error('RFID key already registered');
    }

    const user = new this.userModel({ rfidKey });
    return user.save();
  }

  async login(rfidKey: string): Promise<string> {
    const user = await this.userModel.findOne({ rfidKey });
    if (!user) {
      throw new Error('RFID not found');
    }

    return `Authenticated User with RFID: ${rfidKey}`;
  }
}