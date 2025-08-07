export interface AuthorDTO {
  _id: string;
  firstname: string;
  lastname: string;
  avatar: string;
}

export interface AskPostDTO {
  _id: string;
  question: string;
  author: AuthorDTO;
}

export interface AIHistoryResponseDTO {
  _id: string;
  post: AskPostDTO;
  input: string;
  output: string;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}
