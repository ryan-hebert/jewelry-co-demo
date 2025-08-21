import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { FavoriteItem, AddFavoriteRequest } from '../types/favorites';
import { apiService } from '../services/api';

// Types for the context
interface FavoritesState {
  items: FavoriteItem[];
  count: number;
  loading: boolean;
  error: string | null;
}

type FavoritesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FAVORITES'; payload: { items: FavoriteItem[]; count: number } }
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'UPDATE_FAVORITE_PRICE'; payload: { id: string; price: number } };

// localStorage key for favorites
const FAVORITES_STORAGE_KEY = 'jewelry-customizer-favorites';

// Load favorites from localStorage
const loadFavoritesFromStorage = (): FavoriteItem[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Error loading favorites from localStorage:', error);
  }
  return [];
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites: FavoriteItem[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn('Error saving favorites to localStorage:', error);
  }
};

// Initial state with localStorage data
const getInitialState = (): FavoritesState => {
  const storedFavorites = loadFavoritesFromStorage();
  return {
    items: storedFavorites,
    count: storedFavorites.length,
    loading: false,
    error: null,
  };
};

const initialState: FavoritesState = getInitialState();

// Reducer function
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_FAVORITES':
      const newStateSet = {
        ...state,
        items: action.payload.items,
        count: action.payload.count,
        loading: false,
        error: null,
      };
      saveFavoritesToStorage(newStateSet.items);
      return newStateSet;
    
    case 'ADD_FAVORITE':
      const newItemsAdd = [...state.items, action.payload];
      const newStateAdd = {
        ...state,
        items: newItemsAdd,
        count: state.count + 1,
        error: null,
      };
      saveFavoritesToStorage(newItemsAdd);
      return newStateAdd;
    
    case 'REMOVE_FAVORITE':
      const newItemsRemove = state.items.filter(item => item.id !== action.payload);
      const newStateRemove = {
        ...state,
        items: newItemsRemove,
        count: state.count - 1,
        error: null,
      };
      saveFavoritesToStorage(newItemsRemove);
      return newStateRemove;
    
    case 'UPDATE_FAVORITE_PRICE':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, price: action.payload.price }
          : item
      );
      const newStateUpdate = {
        ...state,
        items: updatedItems,
        error: null,
      };
      saveFavoritesToStorage(updatedItems);
      return newStateUpdate;
    
    default:
      return state;
  }
}

// Context interface
interface FavoritesContextType {
  state: FavoritesState;
  loadFavorites: () => Promise<void>;
  addFavorite: (request: AddFavoriteRequest) => Promise<boolean>;
  removeFavorite: (id: string) => Promise<boolean>;
  checkFavorite: (productId: number, metal: string, stone: string, caratSize: string, ringSize?: string, necklaceSize?: string) => Promise<boolean>;
  isFavorited: (productId: number, metal: string, stone: string, caratSize: string, ringSize?: string, necklaceSize?: string) => boolean;
  getFavoriteId: (productId: number, metal: string, stone: string, caratSize: string, ringSize?: string, necklaceSize?: string) => string | null;
}

// Create context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider component
interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Load from localStorage (already loaded in initial state, but refresh just in case)
      const storedFavorites = loadFavoritesFromStorage();
      dispatch({ type: 'SET_FAVORITES', payload: { items: storedFavorites, count: storedFavorites.length } });
      
      // Optionally sync with server in background (non-blocking)
      try {
        const response = await apiService.getFavorites();
        // Only update if server has more recent data (in a real app, you'd check timestamps)
        if (response.items.length > 0) {
          // Server sync available, but using local storage for now
        }
      } catch (apiError) {
        console.warn('Failed to sync with server, using local storage:', apiError);
      }
      
    } catch (error) {
      console.error('Error loading favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load favorites' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addFavorite = async (request: AddFavoriteRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Check for duplicates locally first
      const isDuplicate = state.items.some(item =>
        item.productId === request.productId &&
        item.metal === request.metal &&
        item.stone === request.stone &&
        item.caratSize === request.caratSize &&
        item.ringSize === request.ringSize &&
        item.necklaceSize === request.necklaceSize
      );

      if (isDuplicate) {
        dispatch({ type: 'SET_ERROR', payload: 'This design is already in your favorites' });
        return false;
      }

      // Create new favorite item locally
      const favoriteItem: FavoriteItem = {
        id: crypto.randomUUID(), // Generate UUID locally
        productId: request.productId,
        productName: request.productName,
        metal: request.metal,
        stone: request.stone,
        caratSize: request.caratSize,
        ringSize: request.ringSize,
        necklaceSize: request.necklaceSize,
        price: request.price,
        createdAt: new Date().toISOString(),
      };

      // Add to local state and localStorage
      dispatch({ type: 'ADD_FAVORITE', payload: favoriteItem });
      
      // Optionally sync with server in background (non-blocking)
      try {
        await apiService.addToFavorites(request);
      } catch (apiError) {
        console.warn('Failed to sync with server, but favorite saved locally:', apiError);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to favorites' });
      return false;
    }
  };

  const removeFavorite = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Remove from local state and localStorage immediately
      dispatch({ type: 'REMOVE_FAVORITE', payload: id });
      
      // Optionally sync with server in background (non-blocking)
      try {
        await apiService.removeFromFavorites(id);
      } catch (apiError) {
        console.warn('Failed to sync with server, but favorite removed locally:', apiError);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from favorites' });
      return false;
    }
  };

  const checkFavorite = async (productId: number, metal: string, stone: string, caratSize: string, ringSize?: string, necklaceSize?: string): Promise<boolean> => {
    try {
      const response = await apiService.checkFavorite(productId, metal, stone, caratSize, ringSize, necklaceSize);
      return response.isFavorited;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  const isFavorited = (productId: number, metal: string, stone: string, caratSize: string, ringSize?: string, necklaceSize?: string): boolean => {
    return state.items.some(item =>
      item.productId === productId &&
      item.metal === metal &&
      item.stone === stone &&
      item.caratSize === caratSize &&
      item.ringSize === ringSize &&
      item.necklaceSize === necklaceSize
    );
  };

  const getFavoriteId = (productId: number, metal: string, stone: string, caratSize: string, ringSize?: string, necklaceSize?: string): string | null => {
    const favorite = state.items.find(item =>
      item.productId === productId &&
      item.metal === metal &&
      item.stone === stone &&
      item.caratSize === caratSize &&
      item.ringSize === ringSize &&
      item.necklaceSize === necklaceSize
    );
    return favorite?.id || null;
  };

  const value: FavoritesContextType = {
    state,
    loadFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    isFavorited,
    getFavoriteId,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook to use the favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
