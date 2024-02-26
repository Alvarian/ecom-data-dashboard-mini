import { z } from "zod";
import { env } from "~/env.js";

import fs from "fs"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import path from "path";


interface Inventory {
  name: string;
  category: string;
  price: number;
  image: string | undefined;
  rating: number;
  review: string;
  quantity: number;
  description: string;
  timeStamp: string;
  position: number;
}

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
  .input(z.object({is_admin: z.boolean()}))
  .query(async ({ ctx, input }) => {
    const rawInventory = (await ctx.spreadsheet.values.get({
      spreadsheetId: env.SHEET_ID,
      range: "inventory"
    })).data.values as string[][] | undefined[][];
    
    if (!rawInventory?.length) return [] as Inventory[]
    
    const structuredInventory = rawInventory.slice(1).map((row: string[] | undefined[], idx: number) => {
      const filename = `${row[0]?.replace(/[^A-Z0-9]/ig, "_").toLowerCase()}-${row[7]}.jpg`
      const inventory: Inventory = {
        name: row[0] ?? '',
        category: row[1] ?? '',
        price: parseFloat(row[2] ?? '0'),
        rating: parseFloat(row[3] ?? '0'),
        review: row[4] ?? '',
        quantity: parseInt(row[5] ?? '0'),
        description: row[6] ?? '',
        timeStamp: row[7] ?? '',
        position: idx + 1,
        image: row[8]
      };
      
      return inventory;
    });    
    
    const presentableStructuredInventory = structuredInventory.filter(si => si.image);

    if (input.is_admin) {
      return structuredInventory;
    }
    
    return presentableStructuredInventory
  }),
  getOne: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ ctx, input }) => {
    const item = ((await ctx.spreadsheet.values.get({
      spreadsheetId: env.SHEET_ID,
      range: `inventory!A${input.id}:I${input.id}`
    })).data.values as string[][] | undefined[][])[0];
    if (!item?.length) return null
    
    const filename = `${item[0]?.replace(/[^A-Z0-9]/ig, "_").toLowerCase()}-${item[7]}.jpg`
    const inventory: Inventory = {
      name: item[0] ?? '',
      category: item[1] ?? '',
      price: parseFloat(item[2] ?? '0'),
      rating: parseFloat(item[3] ?? '0'),
      review: item[4] ?? '',
      quantity: parseInt(item[5] ?? '0'),
      description: item[6] ?? '',
      timeStamp: item[7] ?? '',
      position: input.id,
      image: filename
    };

    return inventory;
  }),
  getTopRated: publicProcedure.query(({ ctx }) => {
    return [];
  }),
});