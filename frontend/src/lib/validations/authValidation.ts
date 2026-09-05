import { z } from "zod";

const baseRegisterSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "First name is required"
          : "Invalid name format",
    })
    .trim()
    .min(2, "Name must be atleast 2 character long")
    .max(55, "Name is too long"),

  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Invalid email format",
    })
    .trim()
    .max(322, "Email is too long")
    .toLowerCase(),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Invalid password format",
    })
    .min(6, "Password to short")
    .max(66, "Password too long")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain a number and a special character",
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export const registerSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  { error: "Password does not match", path: ["confirmPassword"] },
);

export const loginSchema = baseRegisterSchema.pick({
  email: true,
  password: true,
});

export type RegisterSchemaValues = z.infer<typeof registerSchema>;
export type LoginSchemaValues = z.infer<typeof loginSchema>;
