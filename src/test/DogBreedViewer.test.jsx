import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import DogBreedViewer from '../components/DogBreedViewer'

// Mock the API client
vi.mock('../utils/apiClient', () => ({
  default: {
    getBreeds: vi.fn(),
    getImages: vi.fn(),
    getCacheStats: vi.fn(() => ({ size: 0, keys: [] })),
    clearCache: vi.fn()
  }
}))

// Import the mocked API client
import apiClient from '../utils/apiClient'

describe('DogBreedViewer', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  test('renders loading state initially', () => {
    apiClient.getBreeds.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<DogBreedViewer />)
    expect(screen.getByText('Loading dog breeds...')).toBeInTheDocument()
  })

  test('renders breed list after successful API call', async () => {
    const mockBreeds = ['bulldog', 'golden retriever', 'german shepherd']
    apiClient.getBreeds.mockResolvedValue(mockBreeds)
    
    render(<DogBreedViewer />)
    
    await waitFor(() => {
      expect(screen.getByText('Select a dog breed...')).toBeInTheDocument()
    })
    
    // Check if breeds are in the dropdown
    mockBreeds.forEach(breed => {
      expect(screen.getByText(breed.charAt(0).toUpperCase() + breed.slice(1))).toBeInTheDocument()
    })
  })

  test('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch breeds'
    apiClient.getBreeds.mockRejectedValue(new Error(errorMessage))
    // Ensure fallback fetch also fails so error UI is rendered
    const originalFetch = global.fetch
    if (originalFetch) {
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))
    } else {
      vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))))
    }
    
    render(<DogBreedViewer />)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load dog breeds:/i)).toBeInTheDocument()
    })

    // Restore fetch
    if (originalFetch) {
      vi.restoreAllMocks()
    } else {
      vi.unstubAllGlobals()
    }
  })

  test('filters breeds based on search input', async () => {
    const mockBreeds = ['bulldog', 'golden retriever', 'german shepherd']
    apiClient.getBreeds.mockResolvedValue(mockBreeds)
    
    render(<DogBreedViewer />)
    
    await waitFor(() => {
      expect(screen.getByText('Select a dog breed...')).toBeInTheDocument()
    })
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search for a dog breed...')
    await userEvent.type(searchInput, 'bulldog')
    
    // Check if only bulldog is visible
    expect(screen.getByText('Bulldog')).toBeInTheDocument()
    expect(screen.queryByText('Golden Retriever')).not.toBeInTheDocument()
    expect(screen.queryByText('German Shepherd')).not.toBeInTheDocument()
  })

  test('shows clear button when search term exists', async () => {
    const mockBreeds = ['bulldog', 'golden retriever']
    apiClient.getBreeds.mockResolvedValue(mockBreeds)
    
    render(<DogBreedViewer />)
    
    await waitFor(() => {
      expect(screen.getByText('Select a dog breed...')).toBeInTheDocument()
    })
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search for a dog breed...')
    await userEvent.type(searchInput, 'bulldog')
    
    // Check if clear button appears
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  test('clears search when clear button is clicked', async () => {
    const mockBreeds = ['bulldog', 'golden retriever']
    apiClient.getBreeds.mockResolvedValue(mockBreeds)
    
    render(<DogBreedViewer />)
    
    await waitFor(() => {
      expect(screen.getByText('Select a dog breed...')).toBeInTheDocument()
    })
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search for a dog breed...')
    await userEvent.type(searchInput, 'bulldog')
    
    // Click clear button
    const clearButton = screen.getByText('Clear')
    await userEvent.click(clearButton)
    
    // Check if search is cleared
    expect(searchInput.value).toBe('')
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  test('loads images when breed is selected', async () => {
    const mockBreeds = ['bulldog']
    const mockImages = ['image1.jpg', 'image2.jpg', 'image3.jpg']
    
    apiClient.getBreeds.mockResolvedValue(mockBreeds)
    apiClient.getImages.mockResolvedValue(mockImages)
    
    render(<DogBreedViewer />)
    
    await waitFor(() => {
      expect(screen.getByText('Select a dog breed...')).toBeInTheDocument()
    })
    
    // Select a breed
    const select = screen.getByDisplayValue('Select a dog breed...')
    await userEvent.selectOptions(select, 'bulldog')
    
    // Check if images are loaded
    await waitFor(() => {
      expect(screen.getByAltText('bulldog dog 1')).toBeInTheDocument()
      expect(screen.getByAltText('bulldog dog 2')).toBeInTheDocument()
      expect(screen.getByAltText('bulldog dog 3')).toBeInTheDocument()
    })
  })

  test('shows loading state when fetching images', async () => {
    const mockBreeds = ['bulldog']
    apiClient.getBreeds.mockResolvedValue(mockBreeds)
    apiClient.getImages.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<DogBreedViewer />)
    
    await waitFor(() => {
      expect(screen.getByText('Select a dog breed...')).toBeInTheDocument()
    })
    
    // Select a breed
    const select = screen.getByDisplayValue('Select a dog breed...')
    await userEvent.selectOptions(select, 'bulldog')
    
    // Check if loading state is shown
    expect(screen.getByText('Loading images for bulldog...')).toBeInTheDocument()
  })
})
