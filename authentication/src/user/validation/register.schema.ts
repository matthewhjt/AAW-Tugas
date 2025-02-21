import { z } from 'zod'

export const registerSchema = z.object({
    body: z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(8).superRefine((password, ctx) => {
            const regexRules = [
                { regex: /[a-z]/, errorMessage: "Password must contain at least one lowercase letter" },
                { regex: /[A-Z]/, errorMessage: "Password must contain at least one uppercase letter" },
                { regex: /\d/, errorMessage: "Password must contain at least one number" },
            ];

            regexRules.forEach(({ regex, errorMessage }) => {
                if (!regex.test(password)) {
                    ctx.addIssue({
                        code: "custom",
                        message: errorMessage,
                        path: ["password"],
                    });
                }
            });
        }),
        full_name: z.string(),
        address: z.string(),
        phone_number: z.string(),
    })
})