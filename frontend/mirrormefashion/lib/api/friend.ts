import api from './api';
import { FriendsResponse } from './types';

export const friendApi = {
  // Fetch all friends
  getAllFriends: async (): Promise<FriendsResponse> => {
    try {
      const response = await api.get<FriendsResponse>('/friend/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw error;
    }
  },

  // Add other friend-related API calls here as needed
  // For example:
  // sendFriendRequest: async (userId: number) => { ... }
  // acceptFriendRequest: async (friendshipId: number) => { ... }
  // declineFriendRequest: async (friendshipId: number) => { ... }
  // cancelFriendRequest: async (friendshipId: number) => { ... }
  // unfriend: async (friendshipId: number) => { ... }
};