import { Document } from "mongoose";

interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  location: string;
}

export default IEvent;
