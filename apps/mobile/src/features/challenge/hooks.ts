import { useState, useCallback } from 'react';
import axios from 'axios';

interface GenerateImageParams {
  name: string;
  activity: string;
  description: string;
  userId: string;
}

interface GenerateImageResult {
  imageUrl: string;
}

export const useGenerateImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerateImageResult | null>(null);

  const generateImage = useCallback(async (params: GenerateImageParams) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.post<GenerateImageResult>('/api/generate-image', params);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateImage, loading, error, data };
};
