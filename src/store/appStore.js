import { create } from 'zustand';
import apiClient from '../api/axios';

export const useAppStore = create((set, get) => ({
  hotels: [],
  isLoading: false,
  favoriteRoomIds: [],

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

  fetchFavorites: async (userId) => {
    if (!userId) return;
    try {
      const response = await apiClient.get(`/hotels/favorites?userId=${userId}`);
      set({ favoriteRoomIds: response.data.map(fav => fav.roomId) });
    } catch (error) {
      set({ favoriteRoomIds: [] });
    }
  },

  addFavorite: async (roomId, userId) => {
    if (!roomId || !userId) return;
    try {
      await apiClient.post(`/hotels/rooms/${roomId}/favorite`, { userId });
      get().fetchFavorites(userId);
    } catch {}
  },

  removeFavorite: async (roomId, userId) => {
    if (!roomId || !userId) return;
    try {
      await apiClient.delete(`/hotels/rooms/${roomId}/favorite`, { data: { userId } });
      get().fetchFavorites(userId);
    } catch {}
  },
}));