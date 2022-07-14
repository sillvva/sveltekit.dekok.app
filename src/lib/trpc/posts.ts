import path from "path";
import { supabase } from "$lib/supabase/client";
import { fetchPosts } from "$lib/supabase/blog";
import { authMiddleware, createRouter } from "./context";
import { getError, getResult } from "./helpers";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const select = "posts";

export const postsRouter = createRouter()
  .middleware(authMiddleware)
  .query("get", {
    input: z
      .object({
        images: z.boolean().nullish()
      })
      .nullish(),
    async resolve({ input }) {
      return await getResult(select, !!input?.images);
    }
  })
  .mutation("post", {
    input: z.object({
      file: z.string(),
      filename: z.string()
    }),
    async resolve({ input: { file, filename } }) {
      const buffer = Buffer.from(file, "base64");
      const extname = path.extname(filename || "");

      let bucket = "";
      if (extname === ".md") bucket = "blog";

      if (!file || !filename) return (await getError("No file")).body;
      if (!extname || !bucket) return (await getError("Invalid file extension")).body;

      const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
        upsert: true
      });

      if (error) throw new TRPCError({ message: error.message, code: "BAD_REQUEST" });
      if (bucket === "blog") await fetchPosts();

      return {
        success: true,
        error: ""
      };
    }
  })
  .mutation("delete", {
    input: z.object({
      slug: z.string()
    }),
    async resolve({ input: { slug } }) {
      const blog = supabase.storage.from("blog");
      const { data } = await blog.list("archive", { search: slug });
      const suffix = data && data.length ? ` (${data.length + 1})` : "";
      const { error } = await blog.move(`${slug}.md`, `archive/${slug}${suffix}.md`);
      
      if (error) throw new TRPCError({ message: error.message, code: "BAD_REQUEST" });
      await fetchPosts();

      return {
        success: true,
        error: ""
      };
    }
  });