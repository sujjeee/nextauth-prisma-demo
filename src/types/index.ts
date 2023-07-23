import { z } from "zod"
import {
    authSignupSchema,
    checkEmailSchema,
    setNewPasswordSchema
} from "@/lib/validations/auth"


export type signUpType = z.infer<typeof authSignupSchema>

export type emailType = z.infer<typeof checkEmailSchema>

export type setNewPasswordType = z.infer<typeof setNewPasswordSchema>