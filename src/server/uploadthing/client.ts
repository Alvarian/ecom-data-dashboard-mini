import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError, UTApi } from "uploadthing/server";
import { sheets } from "~/server/google/client";
import { env } from "~/env.js";
import { z } from "zod";

 
const f = createUploadthing({
    /**
     * Log out more information about the error, but don't return it to the client
     * @see https://docs.uploadthing.com/errors#error-formatting
     */
    errorFormatter: (err) => {
      console.log("Error uploading file", err.message);
      console.log("  - Above error caused by:", err.cause);
  
      return { message: err.message };
    },
});
const auth = (req: NextApiRequest) => {
    const session = getAuth(req);
    return session.userId;
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .input(z.object({idx: z.string()}))
        .middleware(async ({ req, input }) => {
            // If you throw, the user will not be able to upload
            const userId = auth(req)
            if (!userId) throw new UploadThingError("Unauthorized");
    
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId, idx: input.idx };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId, metadata.idx);
    
            console.log("file url", file.url);

            await sheets.values.append({
                spreadsheetId: env.SHEET_ID,
                range: `inventory!I${metadata.idx}`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                  values: [[file.url]]
                }
            })
    
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
    updateImage: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .input(z.object({idx: z.string(), previousUrl: z.string()}))
        .middleware(async ({ req, input }) => {
            const { idx, previousUrl } = input
            // If you throw, the user will not be able to upload
            const userId = auth(req)
            if (!userId) throw new UploadThingError("Unauthorized");
    
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId, idx, previousUrl };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId, metadata.idx);
    
            await utapi.deleteFiles(metadata.previousUrl)
            await sheets.values.update({
                spreadsheetId: env.SHEET_ID,
                range: `inventory!I${metadata.idx}`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                  values: [[file.url]]
                }
            })
    
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),        
} satisfies FileRouter;

export const utapi = new UTApi();

export type OurFileRouter = typeof ourFileRouter;