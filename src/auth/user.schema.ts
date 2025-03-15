import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  rfidKey: string; // Unique RFID UID for authentication
}

export const UserSchema = SchemaFactory.createForClass(User);