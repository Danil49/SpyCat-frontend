'use client'

import { Cat } from '../types/cat'

interface CatListProps {
  cats: Cat[]
  onEdit: (cat: Cat) => void
  onDelete: (id: number) => void
}

export default function CatList({ cats, onEdit, onDelete }: CatListProps) {
  if (cats.length === 0) {
    return (
      <div className="text-center py-16 bg-white shadow rounded-md">
        <svg
          className="mx-auto h-14 w-14 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No cats found</h3>
        <p className="mt-2 text-sm text-gray-500">Get started by adding a new cat.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg pt-6">
        <ul role="list" className="divide-y divide-gray-200">
        {cats.map((cat) => (
          <li key={cat.id} className="hover:bg-gray-50 transition">
            <div className="px-6 py-5 flex items-center justify-between">
              {/* Avatar + Info */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-base font-bold text-white">
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-md font-semibold text-gray-900">
                    {cat.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {cat.breed} • {cat.years_of_experience} yrs exp
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  ${cat.salary.toLocaleString()}
                </span>
                <button
                  onClick={() => onEdit(cat)}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
