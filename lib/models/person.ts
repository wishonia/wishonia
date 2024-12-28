import { User, Person, Prisma } from '@prisma/client'

import prisma from '@/lib/prisma'

function hasValue(value: string | null): value is string {
  return value !== null && value !== ''
}

function mapUserToPerson(user: User): Prisma.PersonUncheckedCreateInput {
  // Required fields with defaults
  const baseFields: Prisma.PersonUncheckedCreateInput = {
    userId: user.id,
    name: user.name || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
  }

  // Optional fields that we only include if they have values
  const optionalFields: Partial<Prisma.PersonUncheckedCreateInput> = {
    phoneNumber: hasValue(user.phoneNumber) ? user.phoneNumber : undefined,
    gender: hasValue(user.gender) ? user.gender : undefined,
    location: hasValue(user.location) ? user.location : undefined,
    stateProvince: hasValue(user.stateProvince) ? user.stateProvince : undefined,
    postalCode: hasValue(user.postalCode) ? user.postalCode : undefined,
    timeZone: hasValue(user.timeZone) ? user.timeZone : undefined,
    profileBannerUrl: hasValue(user.profileBannerUrl) ? user.profileBannerUrl : undefined,
    image: hasValue(user.image) ? user.image : undefined,
    website: hasValue(user.website) ? user.website : undefined,
    twitterHandle: hasValue(user.twitterHandle) ? user.twitterHandle : undefined,
    githubUsername: hasValue(user.githubUsername) ? user.githubUsername : undefined,
  }

  return { ...baseFields, ...optionalFields }
}

export async function getOrCreatePersonForUser(user: User): Promise<Person> {
  // Try to find existing person
  let person = await prisma.person.findUnique({
    where: { userId: user.id }
  })

  if (!person) {
    // Create new person with required and optional fields
    person = await prisma.person.create({
      data: mapUserToPerson(user)
    })
  } else {
    // Update existing person with only changed fields
    const updates = mapUserToPerson(user)
    delete updates.userId // Don't update userId on existing person
    
    person = await prisma.person.update({
      where: { id: person.id },
      data: updates
    })
  }

  return person
} 