import { z } from "zod";

import { createFloatSchema } from "@/libs/zod/schemas";

export const spotFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  latitude: createFloatSchema(z.number().min(-90).max(90)),
  longitude: createFloatSchema(z.number().min(-180).max(180)),
});

export type SpotFormInput = z.input<typeof spotFormSchema>;
