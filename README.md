# Dog Breed Viewer

A React-based single-page application that allows users to browse dog breeds and view random images for selected breeds. Built with Vite and React Hooks.

## Features

- 🐕 Browse a comprehensive list of dog breeds
- 🔍 Search and filter breeds by name
- 🖼️ View 3 random images for any selected breed
- ⚡ Fast loading with Vite
- 📱 Responsive design for all devices
- 🔄 Loading states and error handling
- 🎨 Clean, modern UI

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd DogBreedViewer
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the development server, typically at `http://localhost:5173`

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```
This serves the production build locally for testing.

## API

This application uses the free [Dog CEO API](https://dog.ceo/dog-api/) which provides:
- List of all dog breeds: `https://dog.ceo/api/breeds/list/all`
- Random images for a specific breed: `https://dog.ceo/api/breed/{breed_name}/images/random/3`

No API key is required.

## Project Structure

```
src/
├── components/
│   └── DogBreedViewer.jsx    # Main component with breed selection and image display
├── App.jsx                   # Root component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## Core Requirements Met

✅ **Fetch and Display Breed List**: Loads all dog breeds from the API on startup  
✅ **Select Breed and View Images**: Shows 3 random images when a breed is selected  
✅ **Search/Filter Input**: Search functionality to find specific breeds  
✅ **API Error Handling**: User-friendly error messages for failed API calls  
✅ **Dynamic Updates**: Images automatically update when selecting different breeds  
✅ **Loading States**: Separate loading indicators for breeds and images  

## Technical Implementation

- **React Hooks**: Uses `useState` and `useEffect` for state management
- **Functional Components**: Modern React with functional components
- **Error Boundaries**: Comprehensive error handling for API failures
- **Responsive Design**: Mobile-first approach with CSS Grid
- **Performance**: Optimized image loading with error fallbacks

## Browser Support

This application works in all modern browsers that support ES6+ features.

## License

This project is created for demonstration purposes.
