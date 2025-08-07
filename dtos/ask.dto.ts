import { Types } from "mongoose";

export type AskPostStatus = "pending" | "answered" | "closed";

export interface CreateAskPostDTO {
  content: string;
  author: Types.ObjectId | string;
  tags?: string[];
  audioUrl?: string;
  media?: string[];
}

export interface UpdateAskPostDTO {
  content?: string;
  fixedByAI?: string;
  tags?: string[];
  audioUrl?: string;
  media?: string[];
  status?: AskPostStatus;
}

export interface AskPostResponseDTO {
  _id: string;
  content: string;
  fixedByAI?: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  tags?: string[];
  audioUrl?: string;
  media?: string[];
  status: AskPostStatus;
  createdAt: string;
  updatedAt: string;
}
