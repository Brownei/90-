// lib/validations/auth.ts

import { z } from "zod";

const WagerSchema = z.object({
  wagerCondition: z.string().min(1, "Please provide a wager condition"),
  amount: z.string().min(1, "Please provide an amount"),
  bookedBy: z.string().min(1, "Booked by is required"),
  wagerLink: z.string().url("Invalid wager link"),
});

type WagerValidation = z.infer<typeof WagerSchema>;

export { WagerSchema };
export type { WagerValidation };
