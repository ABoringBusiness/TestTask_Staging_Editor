import axios from 'axios';

const MEDIA_MAGIC_API_URL = 'https://api-qa.mediamagic.ai/api/v1/deployments';
const API_KEY = '732f9fbb-438c-11ee-a621-7200d0d07471';

export const deployRoomRedesign = async (prompt: any) => {
  console.log('prompt', prompt);
  try {
    const response = await axios.post(
      MEDIA_MAGIC_API_URL,
      {
        name: 'Room Redesign with Text',
        model_id: '05e491a9-2f93-4991-b141-ecbfc60fe44c',
        args: {
          Prompt: prompt ? prompt : 'add a fan',
          'Room Photo':
            'https://cdn.mediamagic.dev/media/ce0b877c-7a43-11ef-a5ee-30d042e69440.jpg',
        },
      },
      {
        headers: {
          'x-mediamagic-key': API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    return null;
  }
};
