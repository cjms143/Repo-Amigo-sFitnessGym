import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';


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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainers`); 
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
      
      const requiredFields = ['name', 'email', 'phone', 'specialty', 'experience', 'bio'];
      const missingFields = requiredFields.filter(field => !trainerData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const formData = new FormData();

      
      const imageBlob = dataURLtoBlob(trainerData.img);
      if (imageBlob) {
        formData.append('img', imageBlob);
      } else if (trainerData.img === null || trainerData.img === '') {
        
        
        
      }

      
      Object.keys(trainerData).forEach(key => {
        if (key !== 'img') { 
          const value = trainerData[key];
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            
            
            
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      });

      
      if (!formData.has('active')) formData.append('active', 'true');
      if (!formData.has('status')) formData.append('status', 'Available');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainers`, { 
        method: 'POST',
        headers: {
          
          Authorization: `Bearer ${token}`
        },
        body: formData 
      });
      
      if (!response.ok) {
        let errorData = { message: 'Failed to add trainer' }; 
        try {
          
          errorData = await response.json();
          console.error('Server error response:', errorData); 
        } catch (parseError) {
          
          const errorText = await response.text();
          console.error('Server error response (non-JSON):', errorText);
          errorData.message = `Server returned status ${response.status}: ${errorText.substring(0, 100)}...`; 
        }
        
        throw new Error(errorData.message || 'Failed to add trainer');
      }
      
      const newTrainer = await response.json();
      setAllTrainers(prev => [...prev, newTrainer]);
      return newTrainer;
    } catch (error) {
      console.error('Error adding trainer:', error); 
      
      throw error; 
    }
  };

  const updateTrainer = async (id, trainerData) => {
    try {
      const formData = new FormData();

      
      
      if (trainerData.img && typeof trainerData.img === 'string' && trainerData.img.startsWith('data:image')) {
        const imageBlob = dataURLtoBlob(trainerData.img);
        if (imageBlob) {
          formData.append('img', imageBlob);
        }
      } else if (trainerData.img === null) {
         
         
      }
      
      

      
      Object.keys(trainerData).forEach(key => {
        if (key !== 'img') { 
          const value = trainerData[key];
           if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
             formData.append(key, JSON.stringify(value));
           } else if (value !== undefined && value !== null) {
             formData.append(key, value);
           }
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainers/${id}`, { 
        method: 'PUT',
        headers: {
          
          Authorization: `Bearer ${token}`
        },
        body: formData 
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainers/${id}/toggle-status`, { 
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainers/${id}`, { 
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