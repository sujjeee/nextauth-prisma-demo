import * as z from "zod"

export const authSigninSchema = z.object({
    email:
        z.string()
            .email({
                message: "Please enter a valid email address",
            }),
    password:
        z.string()
            .min(8, {
                message: "Password must be at least 8 characters long",
            })
            .max(100)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
                message:
                    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
            }),
});

export const authSignupSchema = authSigninSchema.extend({
    name:
        z.string()
            .min(3, {
                message: "Name must be at least 3 characters long",
            })
});

export const checkEmailSchema = z.object({
    email: authSigninSchema.shape.email,
});

export const EmailVerifyCodeSchema = z.object({
    code:
        z.string()
            .min(6, {
                message: "Verification code must be 6 characters long",
            })
            .max(6),
});

export const setNewPasswordSchema = z.object({
    password: authSigninSchema.shape.password,
    confirmPassword: authSigninSchema.shape.password,
    token: z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })