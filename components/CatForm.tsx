'use client'

import { useState, useEffect } from 'react'
import { Cat } from '../types/cat'
import { createCat, updateCat, getValidBreeds } from '../lib/api'

interface CatFormProps {
  cat?: Cat | null
  onSuccess: () => void
  onCancel: () => void
}

export default function CatForm({ cat, onSuccess, onCancel }: CatFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    years_of_experience: '',
    breed: '',
    salary: ''
  })
  const [validBreeds, setValidBreeds] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [loadingBreeds, setLoadingBreeds] = useState(false)

  const isEditing = Boolean(cat)

  useEffect(() => {
    if (cat) {
      setFormData({
        name: cat.name,
        years_of_experience: cat.years_of_experience.toString(),
        breed: cat.breed,
        salary: cat.salary.toString()
      })
    }
  }, [cat])

  useEffect(() => {
    fetchValidBreeds()
  }, [])

  const fetchValidBreeds = async () => {
    try {
      setLoadingBreeds(true)
      const breeds = await getValidBreeds()
      setValidBreeds(breeds)
    } catch (err) {
      console.error('Failed to fetch breeds:', err)
    } finally {
      setLoadingBreeds(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.years_of_experience) {
      newErrors.years_of_experience = 'Years of experience is required'
    } else if (parseInt(formData.years_of_experience) < 0) {
      newErrors.years_of_experience = 'Years of experience must be non-negative'
    }

    if (!formData.breed) {
      newErrors.breed = 'Breed is required'
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required'
    } else if (parseFloat(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be positive'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const catData = {
        name: formData.name.trim(),
        years_of_experience: parseInt(formData.years_of_experience),
        breed: formData.breed,
        salary: parseFloat(formData.salary)
      }

      if (isEditing && cat) {
        // Only salary can be updated
        await updateCat(cat.id, { salary: catData.salary })
      } else {
        await createCat(catData)
      }

      onSuccess()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'An error occurred'
      if (errorMessage.includes('breed')) {
        setErrors({ breed: errorMessage })
      } else {
        setErrors({ general: errorMessage })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Edit Cat' : 'Add New Cat'}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          {isEditing 
            ? 'Update the cat salary (only salary can be modified)' 
            : 'Enter the cat information below'
          }
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{errors.general}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${errors.name ? 'border-red-300' : ''}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="years_of_experience" className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <input
            type="number"
            name="years_of_experience"
            id="years_of_experience"
            min="0"
            value={formData.years_of_experience}
            onChange={handleInputChange}
            disabled={isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${errors.years_of_experience ? 'border-red-300' : ''}`}
          />
          {errors.years_of_experience && (
            <p className="mt-1 text-sm text-red-600">{errors.years_of_experience}</p>
          )}
        </div>

        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
            Breed
          </label>
          <select
            name="breed"
            id="breed"
            value={formData.breed}
            onChange={handleInputChange}
            disabled={isEditing || loadingBreeds}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${errors.breed ? 'border-red-300' : ''}`}
          >
            <option value="">
              {loadingBreeds ? 'Loading...' : 'Select a breed'}
            </option>
            {validBreeds.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {errors.breed && (
            <p className="mt-1 text-sm text-red-600">{errors.breed}</p>
          )}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <input
            type="number"
            name="salary"
            id="salary"
            min="0"
            step="0.01"
            value={formData.salary}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.salary ? 'border-red-300' : ''
            }`}
          />
          {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Cat' : 'Add Cat')}
          </button>
        </div>
      </form>
    </div>
  )
}
