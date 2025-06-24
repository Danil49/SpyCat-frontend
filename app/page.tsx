'use client'

import { useState, useEffect } from 'react'
import CatList from '../components/CatList'
import CatForm from '../components/CatForm'
import { Cat } from '../types/cat'
import { getCats, deleteCat } from '../lib/api'

export default function Home() {
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCat, setEditingCat] = useState<Cat | null>(null)

  useEffect(() => {
    fetchCats()
  }, [])

  const fetchCats = async () => {
    try {
      setLoading(true)
      const data = await getCats()
      setCats(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch cats')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCat = () => {
    setEditingCat(null)
    setShowForm(true)
  }

  const handleEditCat = (cat: Cat) => {
    setEditingCat(cat)
    setShowForm(true)
  }

  const handleDeleteCat = async (id: number) => {
    if (!confirm('Are you sure you want to delete this cat?')) {
      return
    }

    try {
      await deleteCat(id)
      await fetchCats()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete cat'
      alert(errorMessage)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    fetchCats()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCat(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Cats</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage surveillance cats and their information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddCat}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Cat
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <CatForm
                cat={editingCat}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <CatList
          cats={cats}
          onEdit={handleEditCat}
          onDelete={handleDeleteCat}
        />
      </div>
    </div>
  )
}
