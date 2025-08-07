export interface CreateVoteDTO {
  commentId: string;
  voteType: "up" | "down";
}

export interface VoteResponseDTO {
  _id: string;
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
  commentId: string;
  voteType: "up" | "down";
  createdAt: string;
  updatedAt: string;
}
