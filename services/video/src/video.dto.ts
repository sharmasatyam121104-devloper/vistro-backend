import z from "zod";

export const createVideoDtoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  size: z.number().gte(0),
  duration: z.number().gte(0),
  path: z.string().min(1, "Path is required"),
}).strict()

export type CreateVideoDto = z.infer<typeof createVideoDtoSchema>