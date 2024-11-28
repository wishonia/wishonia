"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Prisma, Skill, User } from "@prisma/client"
import {
  Cake,
  ChevronDown,
  ChevronUp,
  Github,
  Globe,
  Languages,
  Lock,
  Mail,
  MapPin,
  Phone,
  Twitter,
  UserCircle,
  User as UserIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

import { updateUser } from "./profileActions"
import { userSchema } from "./userSchema"
// Import icons
import UserSkills from "./UserSkills"

type FormData = Omit<
  Prisma.UserUpdateInput,
  | "createdAt"
  | "updatedAt"
  | "emailVerified"
  | "lastSignInAt"
  | "createdAtTwitter"
  | "deletedAt"
  | "favouritesCount"
  | "followersCount"
  | "followingCount"
  | "likeCount"
  | "listedCount"
  | "points"
  | "statusesCount"
  | "tweetCount"
  | "privateMetadata"
  | "publicMetadata"
  | "unsafeMetadata"
  | "ipAddress"
  | "signatureTimestamp"
  | "referrerUserId"
>

type FormSection = "personal" | "contact" | "online" | "preferences" | "skills"

type UserSkillWithSkill = {
  id: string
  skillId: string
  skill: Skill
}

export default function ProfileForm({
  user,
}: {
  user: User & { userSkills: UserSkillWithSkill[] }
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSections, setOpenSections] = useState<FormSection[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  })

  const toggleSection = (section: FormSection) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const onSubmit = async (data: FormData, section: FormSection) => {
    setIsSubmitting(true)
    try {
      // Create an object with only the modified fields
      const modifiedData = Object.keys(dirtyFields).reduce((acc, key) => {
        const value = data[key as keyof FormData]
        // Handle null values for JSON fields
        if (key === "badges") {
          return {
            ...acc,
            [key]: value === null ? Prisma.JsonNull : value,
          }
        }
        return {
          ...acc,
          [key]: value,
        }
      }, {} as Prisma.UserUpdateInput)

      // Prepare the update data with proper typing
      const updateData: UpdateUserData = {
        id: user.id,
        ...modifiedData,
      }

      await updateUser(updateData)
      toast({
        title: "Section updated",
        description: `Your ${section} information has been successfully updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSection = (
    title: string,
    section: FormSection,
    content: React.ReactNode
  ) => (
    <div className="mb-4 rounded-lg border p-4">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="flex w-full items-center justify-between text-left"
      >
        <h2 className="text-2xl font-bold">{title}</h2>
        {openSections.includes(section) ? <ChevronUp /> : <ChevronDown />}
      </button>
      {openSections.includes(section) && (
        <div className="mt-4 space-y-4">
          {content}
          <Button
            type="button"
            onClick={() => handleSubmit((data) => onSubmit(data, section))()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <form className="space-y-8">
      {renderSection(
        "Personal Information",
        "personal",
        <>
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <UserIcon size={16} className="text-gray-500" />
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                {...register("username")}
                className="pl-8"
                placeholder="johndoe"
              />
              <UserIcon
                size={16}
                className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <UserIcon size={18} />
                First Name
              </Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <UserIcon size={18} />
                Last Name
              </Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <UserCircle size={18} />
              Bio
            </Label>
            <Textarea id="bio" {...register("bio")} />
            {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="birthday" className="flex items-center gap-2">
                <Cake size={18} />
                Birthday
              </Label>
              <Input id="birthday" type="date" {...register("birthday")} />
              {errors.birthday && (
                <p className="text-red-500">{errors.birthday.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="gender" className="flex items-center gap-2">
                <UserCircle size={18} />
                Gender
              </Label>
              <Select
                onValueChange={(value) =>
                  register("gender").onChange({ target: { value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="language" className="flex items-center gap-2">
                <Languages size={18} />
                Preferred Language
              </Label>
              <Input id="language" {...register("language")} />
              {errors.language && (
                <p className="text-red-500">{errors.language.message}</p>
              )}
            </div>
          </div>
        </>
      )}

      {renderSection(
        "Contact Information",
        "contact",
        <>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail size={18} />
              Email
            </Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone size={18} />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              placeholder="+1 (123) 456-7890"
            />
            {errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin size={18} />
                Address
              </Label>
              <Input id="address" {...register("address")} />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin size={18} />
                City
              </Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label
                htmlFor="stateProvince"
                className="flex items-center gap-2"
              >
                <MapPin size={18} />
                State/Province
              </Label>
              <Input id="stateProvince" {...register("stateProvince")} />
              {errors.stateProvince && (
                <p className="text-red-500">{errors.stateProvince.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode" className="flex items-center gap-2">
                <MapPin size={18} />
                Postal Code
              </Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode && (
                <p className="text-red-500">{errors.postalCode.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="countryCode" className="flex items-center gap-2">
                <MapPin size={18} />
                Country Code
              </Label>
              <Input id="countryCode" {...register("countryCode")} />
              {errors.countryCode && (
                <p className="text-red-500">{errors.countryCode.message}</p>
              )}
            </div>
          </div>
        </>
      )}

      {renderSection(
        "Online Presence",
        "online",
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Globe size={16} className="text-gray-500" />
                Website
              </Label>
              <div className="relative">
                <Input
                  id="website"
                  {...register("website")}
                  className="pl-20"
                  placeholder="www.example.com"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 transform text-sm text-gray-500">
                  https://
                </span>
              </div>
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="blog"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Globe size={16} className="text-gray-500" />
                Blog
              </Label>
              <div className="relative">
                <Input
                  id="blog"
                  {...register("blog")}
                  className="pl-20"
                  placeholder="blog.example.com"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 transform text-sm text-gray-500">
                  https://
                </span>
              </div>
              {errors.blog && (
                <p className="text-sm text-red-500">{errors.blog.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="githubUsername"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Github size={16} className="text-gray-500" />
                GitHub Username
              </Label>
              <div className="relative">
                <Input
                  id="githubUsername"
                  {...register("githubUsername")}
                  className="pl-8"
                  placeholder="github-user"
                />
                <Github
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400"
                />
              </div>
              {errors.githubUsername && (
                <p className="text-sm text-red-500">
                  {errors.githubUsername.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="twitterHandle"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Twitter size={16} className="text-gray-500" />
                Twitter Handle
              </Label>
              <div className="relative">
                <Input
                  id="twitterHandle"
                  {...register("twitterHandle")}
                  className="pl-8"
                  placeholder="twitter_handle"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 transform text-sm text-gray-500">
                  @
                </span>
              </div>
              {errors.twitterHandle && (
                <p className="text-sm text-red-500">
                  {errors.twitterHandle.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {renderSection(
        "Preferences and Settings",
        "preferences",
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletterSubscribed"
              {...register("newsletterSubscribed")}
            />
            <Label
              htmlFor="newsletterSubscribed"
              className="flex items-center gap-2"
            >
              <Mail size={18} />
              Subscribe to newsletter
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gdprConsent" {...register("gdprConsent")} />
            <Label htmlFor="gdprConsent" className="flex items-center gap-2">
              <Lock size={18} />
              GDPR Consent
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="hireable" {...register("hireable")} />
            <Label htmlFor="hireable">Available for hire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contributorsEnabled"
              {...register("contributorsEnabled")}
            />
            <Label htmlFor="contributorsEnabled">Enable contributors</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="geoEnabled" {...register("geoEnabled")} />
            <Label htmlFor="geoEnabled">Enable geolocation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="protected" {...register("protected")} />
            <Label htmlFor="protected">Protected account</Label>
          </div>
        </div>
      )}

      {renderSection("Skills", "skills", <UserSkills user={user} />)}
    </form>
  )
}
