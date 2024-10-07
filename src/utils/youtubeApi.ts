import axios from 'axios';

const API_KEY = 'AIzaSyBpJnKD62XnwdoDxka5yMHbk_9DYwZJJSs';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const searchYouTube = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        key: API_KEY,
        type: 'video',
        maxResults: 10,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
};

export const getPlaylistItems = async (playlistId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId: playlistId,
        key: API_KEY,
        maxResults: 50,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return [];
  }
};