// PostComments.types.ts
import { Comment as CommentBE } from "@/types/comment";

/** BE model + extra “view‑state” props the UI needs */
export interface CommentUI extends CommentBE {
  likes?: number;
  likedByUser?: boolean;
}
