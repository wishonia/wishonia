import Link from "next/link"
import React from "react"

import { prisma } from "@/lib/prisma"

import RatedTreatmentsSearchFilter from "../components/RatedTreatmentsSearchFilter"

const ITEMS_PER_PAGE = 8

export default async function TreatmentListPage({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string }
}) {
  const search = searchParams?.search || ""
  const currentPage = Number(searchParams?.page) || 1

  const totalTreatments = await prisma.dfdaTreatment.count({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        {
          conditionTreatments: {
            some: {
              condition: { name: { contains: search, mode: "insensitive" } },
            },
          },
        },
        {
          treatmentSideEffects: {
            some: {
              sideEffect: { name: { contains: search, mode: "insensitive" } },
            },
          },
        },
      ],
    },
  })

  const treatments = await prisma.dfdaTreatment.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      numberOfConditions: true,
      numberOfSideEffects: true,
      conditionTreatments: {
        select: {
          condition: {
            select: { name: true },
          },
        },
        take: 3,
      },
      treatmentSideEffects: {
        select: {
          sideEffect: {
            select: { name: true },
          },
        },
        take: 3,
      },
    },
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        {
          conditionTreatments: {
            some: {
              condition: { name: { contains: search, mode: "insensitive" } },
            },
          },
        },
        {
          treatmentSideEffects: {
            some: {
              sideEffect: { name: { contains: search, mode: "insensitive" } },
            },
          },
        },
      ],
    },
    orderBy: [
      { numberOfConditions: "desc" },
      { numberOfSideEffects: "desc" },
      { name: "asc" },
    ],
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  })

  const totalPages = Math.ceil(totalTreatments / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-6">
        <h1 className="inline-block -rotate-1 border-4 border-black bg-yellow-300 px-4 py-2 text-4xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Treatments Database
        </h1>
        <RatedTreatmentsSearchFilter />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {treatments.map((treatment, index) => (
          <Link href={`/dfda/treatments/${treatment.name}`} key={treatment.id}>
            <div
              className={`
                            transform border-4 border-black bg-white 
                            p-6 transition-all
                            duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            ${index % 3 === 0 ? "rotate-1" : index % 3 === 1 ? "-rotate-1" : "rotate-0"}
                            ${
                              index % 4 === 0
                                ? "bg-orange-200"
                                : index % 4 === 1
                                  ? "bg-blue-200"
                                  : index % 4 === 2
                                    ? "bg-green-200"
                                    : "bg-purple-200"
                            }
                        `}
            >
              <h2 className="mb-4 line-clamp-2 text-2xl font-black">
                {treatment.name}
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-bold">Top Conditions:</div>
                  <div className="flex flex-wrap gap-2">
                    {treatment.conditionTreatments.map((ct) => (
                      <span
                        key={ct.condition.name}
                        className="
                                                border-2 border-black bg-white
                                                px-2 py-1 text-sm
                                                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                            "
                      >
                        {ct.condition.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <span
                    className="
                                        border-2 border-black bg-white px-3
                                        py-1 text-sm font-bold
                                        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                    "
                  >
                    {treatment.numberOfConditions ?? 0} Conditions
                  </span>
                  <span
                    className="
                                        border-2 border-black bg-white px-3
                                        py-1 text-sm font-bold
                                        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                    "
                  >
                    {treatment.numberOfSideEffects} Side Effects
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {treatments.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-xl font-bold">
            No treatments found matching "{search}"
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/dfda/treatments?page=${currentPage - 1}${search ? `&search=${search}` : ""}`}
              className="
                                border-4 border-black bg-white
                                px-4 py-2
                                font-bold
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                transition-all
                                duration-200 hover:-translate-y-0.5
                                hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            "
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 font-bold">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/dfda/treatments?page=${currentPage + 1}${search ? `&search=${search}` : ""}`}
              className="
                                border-4 border-black bg-white
                                px-4 py-2
                                font-bold
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                transition-all
                                duration-200 hover:-translate-y-0.5
                                hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            "
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}