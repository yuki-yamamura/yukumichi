import z from "zod";

import { base62Decode } from "@/presentation/helpers/id";

export const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const publicIdSchema = z
  .string()
  .regex(/^[0-9A-Za-z]{22}$/)
  .transform(base62Decode);
