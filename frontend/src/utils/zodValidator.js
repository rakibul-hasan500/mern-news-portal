import * as z from "zod"


// Login Schema
export const loginSchema = z.object({

    email: z
        .string()
        .min(1, "Enter your email address.")
        .email("Invalid email address."),

    password: z
        .string()
        .min(1, "Enter your password.")
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.")
})



// Register Schema
export const registerSchema = z.object({

    name: z
        .string()
        .min(1, "Enter your name."),

    email: z
        .string()
        .min(1, "Enter your email address.")
        .email("Invalid email address."),

    password: z
        .string()
        .min(1, "Enter your password.")
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),

    confirmPassword: z
        .string()
        .min(1, "Confirm your password.")

})
    .refine((data)=>data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"]
    })




