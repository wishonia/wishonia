import { z } from "zod"





export const userSchema = z
  .object({
    address: z.string().optional().nullable(),
    badges: z.any().optional().nullable(), // Json type
    banned: z.boolean().optional().nullable(),
    bio: z.string().optional().nullable(),
    birthday: z
      .string()
      .optional()
      .nullable()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),
    blog: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
    city: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    contributorsEnabled: z.boolean().optional().nullable(),
    countryCode: z.string().optional().nullable(),
    email: z.string().email("Invalid email address").optional().nullable(),
    firstName: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    geoEnabled: z.boolean().optional().nullable(),
    githubUsername: z.string().optional().nullable(),
    hireable: z.boolean().optional().nullable(),
    image: z
      .string()
      .url("Invalid URL")
      .optional()
      .nullable()
      .or(z.literal("")),
    language: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    newsletterSubscribed: z.boolean().optional(),
    phoneNumber: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    profileBannerUrl: z
      .string()
      .url("Invalid URL")
      .optional()
      .nullable()
      .or(z.literal("")),
    protected: z.boolean().optional().nullable(),
    signedPetition: z.boolean().optional(),
    stateProvince: z.string().optional().nullable(),
    timeZone: z.string().optional().nullable(),
    twitterHandle: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    username: z.string().optional().nullable(),
    verified: z.boolean().optional().nullable(),
    warPercentageDesired: z.number().min(0).max(100).optional().nullable(),
    warPercentageGuessed: z.number().min(0).max(100).optional().nullable(),
    web3Wallet: z.string().optional().nullable(),
    website: z
      .string()
      .url("Invalid URL")
      .optional()
      .nullable()
      .or(z.literal("")),
  })
  .partial()

export type UserUpdateInput = z.infer<typeof userSchema>
