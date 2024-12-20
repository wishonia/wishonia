'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routeTree, type RouteNode } from '@/config/routeTree'

interface BreadcrumbDropdownProps {
  node: RouteNode
  currentPath: string[]
  currentSegment: string
  onClose: () => void
}

function BreadcrumbDropdown({ node, currentPath, currentSegment, onClose }: BreadcrumbDropdownProps) {
  const pathIndex = currentPath.indexOf(currentSegment)
  const basePath = '/' + currentPath.slice(0, pathIndex + 1).join('/')

  return (
    <div className="absolute top-full left-0 mt-1 bg-white/90 rounded-md shadow-lg py-1 z-50">
      <Link
        href={basePath}
        className="block px-4 py-2 hover:bg-black/10"
        onClick={onClose}
      >
        {node.isDynamic ? `[${node.name}]` : node.name}
      </Link>
      
      {Object.keys(node.children).length > 0 && (
        <div className="border-t border-gray-200 my-1"></div>
      )}

      {Object.entries(node.children)
        .filter(([_, childNode]) => !childNode.name.startsWith('...'))
        .map(([key, childNode]) => {
          const href = `${basePath}/${key}`
          return (
            <Link
              key={key}
              href={href}
              className="block px-4 py-2 hover:bg-black/10"
              onClick={onClose}
            >
              {childNode.isDynamic ? `[${childNode.name}]` : childNode.name}
            </Link>
          )
      })}
    </div>
  )
}

interface BreadcrumbItemProps {
  segment: string
  node: RouteNode
  currentPath: string[]
  isLast: boolean
  dynamicValues: Record<string, string>
}

function BreadcrumbItem({ segment, node, currentPath, isLast, dynamicValues }: BreadcrumbItemProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const children = Object.entries(node.children)
  const hasChildren = children.length > 0
  const hasSingleChild = children.length === 1
  const displayName = node.isDynamic ? dynamicValues[node.name] || `[${node.name}]` : segment

  // If there's only one child, construct its href as absolute path
  const singleChildHref = hasSingleChild ? 
    '/' + [...currentPath.slice(0, currentPath.indexOf(segment) + 1), children[0][0]].join('/') : 
    undefined

  return (
    <li className="flex items-center">
      <div className="relative">
        {hasChildren ? (
          hasSingleChild ? (
            // Single child case - render as link
            <Link 
              href={singleChildHref!}
              className="flex items-center hover:opacity-70"
            >
              {displayName}
            </Link>
          ) : (
            // Multiple children case - render as dropdown
            <button
              className="flex items-center hover:opacity-70"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {displayName}
              <svg
                className="w-4 h-4 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )
        ) : (
          <span className={isLast ? 'opacity-70' : ''}>
            {displayName}
          </span>
        )}
        {dropdownOpen && hasChildren && !hasSingleChild && (
          <BreadcrumbDropdown
            node={node}
            currentPath={currentPath}
            currentSegment={segment}
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </div>
      {!isLast && <span className="mx-2">/</span>}
    </li>
  )
}

interface BreadcrumbsProps {
  dynamicValues?: Record<string, string>
  startSegment?: string
}

export function Breadcrumbs({ dynamicValues = {}, startSegment }: BreadcrumbsProps) {
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false)
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // If startSegment is provided, remove it and all segments before it from the path
  const startIndex = startSegment ? pathSegments.indexOf(startSegment) : -1
  const filteredSegments = startIndex !== -1 ? 
    pathSegments.slice(startIndex + 1) : 
    pathSegments

  // Find the starting node based on startSegment
  let startNode: RouteNode = routeTree
  if (startSegment) {
    for (const segment of pathSegments.slice(0, startIndex + 1)) {
      const node = Object.values(startNode.children).find(child => 
        child.name === segment ||
        (child.isDynamic && !child.name.startsWith('...'))
      )
      if (node) startNode = node
    }
  }

  let currentNode: RouteNode = startNode
  const breadcrumbs = filteredSegments.map((segment, index) => {
    const node = Object.values(currentNode.children).find(child => 
      child.name === segment ||
      (child.isDynamic && !child.name.startsWith('...'))
    )
    
    if (!node) return null
    currentNode = node as typeof currentNode
    
    return {
      segment,
      node,
      isLast: index === filteredSegments.length - 1
    }
  }).filter(Boolean)

  return (
    <nav>
      <ol className="flex flex-wrap items-center">
        <li className="flex items-center">
          {startSegment ? (
            <div className="relative">
              <button
                className="hover:opacity-70 flex items-center"
                onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
              >
                🏠
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {homeDropdownOpen && (
                <BreadcrumbDropdown
                  node={startNode}
                  currentPath={pathSegments.slice(0, startIndex + 1)}
                  currentSegment={startSegment}
                  onClose={() => setHomeDropdownOpen(false)}
                />
              )}
            </div>
          ) : (
            <Link href="/" className="hover:opacity-70">
              🏠
            </Link>
          )}
          {breadcrumbs.length > 0 && <span className="mx-2">/</span>}
        </li>
        {breadcrumbs.map((item, index) => (
          <BreadcrumbItem
            key={index}
            segment={item!.segment}
            node={item!.node}
            currentPath={filteredSegments}
            isLast={item!.isLast}
            dynamicValues={dynamicValues}
          />
        ))}
      </ol>
    </nav>
  )
} 