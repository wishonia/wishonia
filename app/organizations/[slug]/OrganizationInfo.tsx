'use client'

import { useState } from 'react'
import { Organization } from '@prisma/client'
import { updateOrganization } from '@/app/organizations/organizationActions'

interface OrganizationInfoProps {
  organization: Organization
  isOwner: boolean
}

export default function OrganizationInfo({ organization, isOwner }: OrganizationInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedOrg, setEditedOrg] = useState(organization)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedOrg = await updateOrganization(organization.id, editedOrg)
      setEditedOrg(updatedOrg)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating organization:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedOrg((prev) => ({ ...prev, [name]: value }))
  }

  if (isEditing) {
    return (
      <form onSubmit={handleEdit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedOrg.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={editedOrg.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedOrg.email || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Telephone</label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={editedOrg.telephone || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save
        </button>
      </form>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-700">{organization.description}</p>
      <p className="text-gray-700">Email: {organization.email}</p>
      <p className="text-gray-700">Phone: {organization.telephone}</p>
      {isOwner && (
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Organization
        </button>
      )}
    </div>
  )
}
