import React, { useState, useEffect } from 'react'
import apiClient from '../utils/apiClient'

const DogBreedViewer = () => {
  const [breeds, setBreeds] = useState([])
  const [filteredBreeds, setFilteredBreeds] = useState([])
  const [selectedBreed, setSelectedBreed] = useState('')
  const [images, setImages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingBreeds, setLoadingBreeds] = useState(true)
  const [loadingImages, setLoadingImages] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all dog breeds on component mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoadingBreeds(true)
        setError(null)
        
        const allBreeds = await apiClient.getBreeds()
        setBreeds(allBreeds)
        setFilteredBreeds(allBreeds)
        console.log(`Loaded ${allBreeds.length} breeds total`)
      } catch (err) {
        console.error('Error fetching breeds with API client:', err)
        
        // Fallback to direct fetch
        try {
          console.log('Trying direct fetch as fallback...')
          const response = await fetch('https://dog.ceo/api/breeds/list/all')
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          
          if (data.status === 'success') {
            const allBreeds = []
            Object.keys(data.message).forEach(breed => {
              allBreeds.push(breed)
              if (data.message[breed].length > 0) {
                data.message[breed].forEach(subBreed => {
                  allBreeds.push(`${subBreed} ${breed}`)
                })
              }
            })
            setBreeds(allBreeds)
            setFilteredBreeds(allBreeds)
            console.log(`Fallback successful: Loaded ${allBreeds.length} breeds`)
          } else {
            throw new Error(data.message || 'Failed to fetch breeds')
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr)
          setError(`Failed to load dog breeds: ${fallbackErr.message}`)
        }
      } finally {
        setLoadingBreeds(false)
      }
    }

    fetchBreeds()
  }, [])

  // Filter breeds based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBreeds(breeds)
    } else {
      const searchLower = searchTerm.toLowerCase()
      const filtered = breeds.filter(breed =>
        breed.toLowerCase().includes(searchLower)
      )
      setFilteredBreeds(filtered)
      console.log(`Searching for "${searchTerm}", found ${filtered.length} breeds`)
    }
  }, [searchTerm, breeds])

  // Fetch images when a breed is selected
  useEffect(() => {
    if (selectedBreed) {
      const fetchImages = async () => {
        try {
          setLoadingImages(true)
          setError(null)
          
          const images = await apiClient.getImages(selectedBreed)
          setImages(images)
        } catch (err) {
          console.error('Error fetching images with API client:', err)
          
          // Fallback to direct fetch
          try {
            console.log('Trying direct fetch for images as fallback...')
            let apiBreed = selectedBreed
            if (selectedBreed.includes(' ')) {
              const parts = selectedBreed.split(' ')
              apiBreed = `${parts[1]}/${parts[0]}`
            }
            
            const response = await fetch(`https://dog.ceo/api/breed/${apiBreed}/images/random/3`)
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            
            if (data.status === 'success') {
              setImages(data.message)
              console.log('Fallback image fetch successful')
            } else {
              throw new Error(data.message || 'Failed to fetch images')
            }
          } catch (fallbackErr) {
            console.error('Fallback image fetch also failed:', fallbackErr)
            setError(`Failed to load images for ${selectedBreed}: ${fallbackErr.message}`)
            setImages([])
          }
        } finally {
          setLoadingImages(false)
        }
      }

      fetchImages()
    }
  }, [selectedBreed])

  const handleBreedChange = (e) => {
    setSelectedBreed(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div>
      {/* Search and Breed Selector */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a dog breed..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={selectedBreed}
          onChange={handleBreedChange}
          className="breed-selector"
          disabled={loadingBreeds}
        >
          <option value="">Select a dog breed...</option>
          {filteredBreeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </option>
          ))}
        </select>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              height: '48px',
              alignSelf: 'center'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading States */}
      {loadingBreeds && (
        <div className="loading">Loading dog breeds...</div>
      )}

      {loadingImages && (
        <div className="loading">Loading images for {selectedBreed}...</div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}


      {/* No Breeds Found */}
      {!loadingBreeds && filteredBreeds.length === 0 && searchTerm && (
        <div className="no-breeds">
          No breeds found matching "{searchTerm}"
        </div>
      )}

      {/* Images Display */}
      {!loadingImages && selectedBreed && images.length > 0 && (
        <div className="images-container">
          {images.map((imageUrl, index) => (
            <div key={index} className="image-card">
              <img
                src={imageUrl}
                alt={`${selectedBreed} dog ${index + 1}`}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div style={{ display: 'none', padding: '1rem', color: '#666' }}>
                Failed to load image
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Images Message */}
      {!loadingImages && selectedBreed && images.length === 0 && !error && (
        <div className="no-images">
          No images available for {selectedBreed}
        </div>
      )}
    </div>
  )
}

export default DogBreedViewer
