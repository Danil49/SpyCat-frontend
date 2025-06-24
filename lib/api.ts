import axios from 'axios'
import { Cat } from '../types/cat'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Cat API functions

export const getCats = async (): Promise<Cat[]> => {
  const response = await api.get('/api/cats/')
  return response.data
}

export const getCat = async (id: number): Promise<Cat> => {
  const response = await api.get(`/api/cats/${id}`)
  return response.data
}

export const createCat = async (cat: Omit<Cat, 'id' | 'created_at' | 'updated_at'>): Promise<Cat> => {
  const response = await api.post('/api/cats/', cat)
  return response.data
}

export const updateCat = async (id: number, updates: { salary: number }): Promise<Cat> => {
  const response = await api.put(`/api/cats/${id}`, updates)
  return response.data
}

export const deleteCat = async (id: number): Promise<void> => {
  await api.delete(`/api/cats/${id}`)
}

export const getValidBreeds = async (): Promise<string[]> => {
  const response = await api.get('/api/cats/breeds/valid')
  return response.data
}

// Mission API functions

export const getMissions = async () => {
  const response = await api.get('/api/missions/')
  return response.data
}

export const createMission = async (mission: any) => {
  const response = await api.post('/api/missions/', mission)
  return response.data
}

export const updateTarget = async (missionId: number, targetId: number, updates: any) => {
  const response = await api.put(`/api/missions/${missionId}/targets/${targetId}`, updates)
  return response.data
}
