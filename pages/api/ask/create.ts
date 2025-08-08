import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware, {
  authenticateToken,
} from "@/middleware/auth-middleware";
import { CreateAskPostDTO } from "@/dtos/ask.dto";
import { createAskPost } from "@/lib/actions/ask.action";
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
            const content = Array.isArray(fields.content)
              ? fields.content[0]
              : fields.content;
            const tags = Array.isArray(fields.tags)
              ? fields.tags
              : fields.tags
              ? [fields.tags]
              : [];
            const audioUrl = Array.isArray(fields.audioUrl)
              ? fields.audioUrl[0]
              : fields.audioUrl;

            let mediaUrls: string[] = [];
            if (files.media) {
              const mediaFiles = Array.isArray(files.media)
                ? files.media
                : [files.media];

              for (const file of mediaFiles) {
                const uploadResult = await cloudinary.uploader.upload(
                  file.filepath,
                  {
                    folder: "AskPost",
                    resource_type: "auto",
                  }
                );
                mediaUrls.push(uploadResult.secure_url);
              }
            }

            const askPostDTO: CreateAskPostDTO = {
              content,
              author: req.user?.id?.toString()!,
              tags,
              audioUrl: audioUrl || undefined,
              media: mediaUrls,
            };

            const newAskPost = await createAskPost(askPostDTO);

            return res.status(201).json(newAskPost);
          } catch (error) {
            console.error("Error creating AskPost:", error);
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
