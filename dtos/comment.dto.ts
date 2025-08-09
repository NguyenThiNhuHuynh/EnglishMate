export interface CreateCommentDTO {
  post: string;
  user: string;
  text: string;
  media?: string[];
}

export interface UpdateCommentDTO {
  text?: string;
  media?: string[];
}

export interface CommentResponseDTO {
  _id: string;
  post: string;
  text: string;
  media: string[];
  upVotes: string[];
  downVotes: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}
