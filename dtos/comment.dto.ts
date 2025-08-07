export interface CreateCommentDTO {
  post: string;
  user: string;
  text: string;
}

export interface UpdateCommentDTO {
  text?: string;
}

export interface CommentResponseDTO {
  _id: string;
  post: string;
  text: string;
  upVotes: number;
  downVotes: number;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
}
