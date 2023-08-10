import { z } from 'zod'

export type Login = z.infer<typeof loginSchema>

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
})
