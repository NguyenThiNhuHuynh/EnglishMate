import { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware, {
  authenticateToken,
} from "@/middleware/auth-middleware";
import { CreateCommentDTO } from "@/dtos/comment.dto";
import { createComment } from "@/lib/actions/comment.action";
import cloudinary from "@/lib/cloudinary";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  corsMiddleware(req, res, async () => {
    authenticateToken(req, res, async () => {
      if (req.method === "POST") {
        const form = new IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error("Form parsing error:", err);
            return res.status(500).json({ message: err.message });
          }

          try {
            const text = Array.isArray(fields.text)
              ? fields.text[0]
              : fields.text;
            const post = Array.isArray(fields.post)
              ? fields.post[0]
              : fields.post;

            let mediaUrls: string[] = [];
            if (files.media) {
              const mediaFiles = Array.isArray(files.media)
                ? files.media
                : [files.media];

              for (const file of mediaFiles) {
                const uploadResult = await cloudinary.uploader.upload(
                  file.filepath,
                  {
                    folder: "CommentMedia",
                    resource_type: "auto",
                  }
                );
                mediaUrls.push(uploadResult.secure_url);
              }
            }

            if (!text || !post) {
              return res
                .status(400)
                .json({ message: "Text and Post are required fields." });
            }

            const createCommentDTO: CreateCommentDTO = {
              post,
              user: req.user?.id?.toString()!,
              text,
              media: mediaUrls,
            };

            const newComment = await createComment(createCommentDTO);

            return res.status(201).json(newComment);
          } catch (error) {
            console.error("Error creating comment:", error);
            return res
              .status(500)
              .json({ message: "An unexpected error occurred." });
          }
        });
      } else {
        return res.status(405).json({ message: "Method Not Allowed" });
      }
    });
  });
};

export default handler;
