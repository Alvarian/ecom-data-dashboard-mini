import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing/client";

import fs from "fs"
import moment from "moment";

import { env } from "process";


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const imageRouter = createTRPCRouter({
  deleteImage: protectedProcedure
    .input(z.object({url: z.string(), idx: z.string()}))
    .mutation(async ({ input, ctx }) => {
      // delete image
      
      try {
        await utapi.deleteFiles(input.url.split("/").pop()!)

        // clear cell
        await ctx.spreadsheet.values.update({
          spreadsheetId: env.SHEET_ID,
          range: `inventory!I${input.idx}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[""]]
          }
        })
        return true
      } catch (err) {
        console.log(err)
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});