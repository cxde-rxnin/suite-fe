import { create } from 'zustand';
import apiClient from '../api/axios';

export const useAppStore = create((set) => ({
  hotels: [],
  isLoading: false,

  // Action to fetch all hotels from our backend
  fetchHotels: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/hotels/all');
      set({ hotels: response.data });
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));