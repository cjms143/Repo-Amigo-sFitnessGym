import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataurl) {
  if (!dataurl) return null;
  try {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    // Extract filename or use a default
    const filename = `profile.${mime.split('/')[1] || 'jpg'}`;
    return new File([u8arr], filename, {type:mime});
  } catch (e) {
    console.error("Error converting data URL to Blob:", e);
    return null;
  }
}

const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [allTrainers, setAllTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/trainers');
      if (!response.ok) throw new Error('Failed to fetch trainers');
      const data = await response.json();
      setAllTrainers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const addTrainer = async (trainerData) => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'specialty', 'experience', 'bio'];
      const missingFields = requiredFields.filter(field => !trainerData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const formData = new FormData();

      // Append image if present
      const imageBlob = dataURLtoBlob(trainerData.img);
      if (imageBlob) {
        formData.append('img', imageBlob);
      } else if (trainerData.img === null || trainerData.img === '') {
        // Handle case where image might be explicitly removed (send empty string or handle on backend)
        // If your backend expects something specific for removal, adjust here.
        // formData.append('img', ''); // Example: Send empty if backend handles it
      }

      // Append other data fields (ensure complex objects like arrays/objects are stringified if backend expects strings)
      Object.keys(trainerData).forEach(key => {
        if (key !== 'img') { // Don't append the original base64 image string
          const value = trainerData[key];
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            // Stringify arrays/objects if the backend expects them as strings in FormData
            // If the backend can parse JSON strings within FormData, this is fine.
            // If the backend expects arrays like field[]=value1&field[]=value2, you need to append differently.
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      });

      // Add default fields if they aren't already in trainerData
      if (!formData.has('active')) formData.append('active', 'true');
      if (!formData.has('status')) formData.append('status', 'Available');

      const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json', // REMOVE THIS - Browser sets it for FormData
          Authorization: `Bearer ${token}`
        },
        body: formData // Send FormData object
      });
      
      if (!response.ok) {
        let errorData = { message: 'Failed to add trainer' }; // Default error
        try {
          // Try to parse the JSON error response from the backend
          errorData = await response.json();
          console.error('Server error response:', errorData); // Log the full server error
        } catch (parseError) {
          // If parsing fails, log the raw response text
          const errorText = await response.text();
          console.error('Server error response (non-JSON):', errorText);
          errorData.message = `Server returned status ${response.status}: ${errorText.substring(0, 100)}...`; // Use status and snippet
        }
        // Throw an error with the server message or the default/parsed one
        throw new Error(errorData.message || 'Failed to add trainer');
      }
      
      const newTrainer = await response.json();
      setAllTrainers(prev => [...prev, newTrainer]);
      return newTrainer;
    } catch (error) {
      console.error('Error adding trainer:', error); // Keep this log
      // Re-throw the error so the component calling addTrainer knows it failed
      throw error; 
    }
  };

  const updateTrainer = async (id, trainerData) => {
    try {
      const formData = new FormData();

      // Append image if present and potentially changed
      // Check if img is a new base64 string (indicating upload)
      if (trainerData.img && typeof trainerData.img === 'string' && trainerData.img.startsWith('data:image')) {
        const imageBlob = dataURLtoBlob(trainerData.img);
        if (imageBlob) {
          formData.append('img', imageBlob);
        }
      } else if (trainerData.img === null) {
         // Handle explicit image removal if needed by backend
         // formData.append('img', ''); // Example
      }
      // Note: If trainerData.img is an existing URL (string but not base64), we don't append it,
      // assuming no change unless a new base64 string is provided.

      // Append other data fields
      Object.keys(trainerData).forEach(key => {
        if (key !== 'img') { // Don't append img unless it was processed above
          const value = trainerData[key];
           if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
             formData.append(key, JSON.stringify(value));
           } else if (value !== undefined && value !== null) {
             formData.append(key, value);
           }
        }
      });

      const response = await fetch(`/api/trainers/${id}`, {
        method: 'PUT',
        headers: {
          // 'Content-Type': 'application/json', // REMOVE THIS
          Authorization: `Bearer ${token}`
        },
        body: formData // Send FormData object
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update trainer');
      }
      
      const updatedTrainer = await response.json();
      setAllTrainers(prev => 
        prev.map(trainer => trainer._id === id ? updatedTrainer : trainer)
      );
      return updatedTrainer;
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  };

  const toggleTrainerStatus = async (id) => {
    try {
      const response = await fetch(`/api/trainers/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to toggle trainer status');
      }
      
      const updatedTrainer = await response.json();
      setAllTrainers(prev => 
        prev.map(trainer => trainer._id === id ? updatedTrainer : trainer)
      );
      return updatedTrainer;
    } catch (error) {
      console.error('Error toggling trainer status:', error);
      throw error;
    }
  };

  const deleteTrainer = async (id) => {
    try {
      const response = await fetch(`/api/trainers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete trainer');
      }
      
      setAllTrainers(prev => prev.filter(trainer => trainer._id !== id));
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  };

  return (
    <TrainerContext.Provider value={{
      allTrainers,
      loading,
      error,
      addTrainer,
      updateTrainer,
      deleteTrainer,
      toggleTrainerStatus,
      refreshTrainers: fetchTrainers
    }}>
      {children}
    </TrainerContext.Provider>
  );
};

export const useTrainers = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainers must be used within a TrainerProvider');
  }
  return context;
};