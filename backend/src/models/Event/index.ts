import mongoose, { Schema } from "mongoose";
import { IEvent } from "../../interfaces";

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "O título é obrigatório."],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "A data é obrigatória."],
  },
  location: {
    type: String,
    required: [true, "O local é obrigatório."],
    trim: true,
  },
});

export default mongoose.model<IEvent>("Event", EventSchema);
