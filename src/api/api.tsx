import apiClient from '../services/Client';
import ApiConfig from '../services/ApiConfig';
import { API_DEPLOYMENT_NAMES, API_MODELS, DEFAULT_ROOM_IMAGES } from '../constant/apiConstants';

interface RoomRedesignArgs {
  Prompt: string;
  'Room Photo': string;
}

interface RoomRestyleArgs {
  'Room Photo': string;
  'Space Name': string;
  'Space Style': string;
}

export interface RoomPaintArgs {
  Color: string;
  Area?: string;
}

export interface DeployRoomRePaintPayload {
  name: string;
  model_id: string;
  args: {
    'Room Photo': string;
    Color: string;
    Area: string;
  };
}

interface DeployRoomReStylePayload {
  name: string;
  model_id: string;
  args: RoomRestyleArgs;
}

interface DeployPayload<T> {
  name: string;
  model_id: string;
  args: T;
}

/**
 * Deploy a room redesign with the given prompt
 * @param prompt Text prompt for room redesign
 * @returns API response data
 * @throws Error if API call fails
 */
export const deployRoomRedesign = async (prompt: string): Promise<any> => {
  const payload: DeployPayload<RoomRedesignArgs> = {
    name: API_DEPLOYMENT_NAMES.ROOM_REDESIGN,
    model_id: API_MODELS.ROOM_REDESIGN,
    args: {
      Prompt: prompt || 'add a fan',
      'Room Photo': DEFAULT_ROOM_IMAGES.REDESIGN,
    },
  };

  try {
    const response = await apiClient.post(ApiConfig.ROOM_DEPLOYMENT, payload);
    return response.data;
  } catch (error) {
    console.error('Error in deployRoomRedesign:', error);
    throw new Error('Failed to deploy room redesign. Please try again.');
  }
};

/**
 * Deploy a room restyle with the given parameters
 * @param prompt Room restyle parameters
 * @returns API response data
 * @throws Error if API call fails
 */
export const deployRoomReStyle = async (prompt?: Partial<RoomRestyleArgs>): Promise<any> => {
  const payload: DeployRoomReStylePayload = {
    name: API_DEPLOYMENT_NAMES.ROOM_RESTYLE,
    model_id: API_MODELS.ROOM_RESTYLE,
    args: {
      'Room Photo': prompt?.['Room Photo'] ?? DEFAULT_ROOM_IMAGES.RESTYLE,
      'Space Name': prompt?.['Space Name'] ?? 'Bed and Living Room',
      'Space Style': prompt?.['Space Style'] ?? 'Modern',
    },
  };

  try {
    const response = await apiClient.post(ApiConfig.ROOM_DEPLOYMENT, payload);
    return response.data;
  } catch (error) {
    console.error('Error deploying room restyle:', error);
    throw new Error('Failed to deploy room restyle. Please try again.');
  }
};

/**
 * Deploy a room repaint with the given color
 * @param colorArgs Color parameters
 * @returns API response data
 * @throws Error if API call fails
 */
export const deployRoomRepaint = async (colorArgs?: Partial<RoomPaintArgs>): Promise<any> => {
  const payload: DeployRoomRePaintPayload = {
    name: API_DEPLOYMENT_NAMES.ROOM_REPAINT,
    model_id: API_MODELS.ROOM_REPAINT,
    args: {
      'Room Photo': DEFAULT_ROOM_IMAGES.REPAINT,
      Color: colorArgs?.Color || 'pink',
      Area: colorArgs?.Area || 'floor',
    },
  };

  try {
    const response = await apiClient.post(ApiConfig.ROOM_DEPLOYMENT, payload);
    return response.data;
  } catch (error) {
    console.error('Error deploying room repaint:', error);
    throw new Error('Failed to deploy room repaint. Please try again.');
  }
};
