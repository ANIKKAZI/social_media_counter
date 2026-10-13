import { useEffect, useState } from 'react';
import { fetchRuntimeConfig } from '../liveData';

const defaultConfig = {
  fallbackPollIntervalMs: 1000,
  googleReviewUrl: 'https://g.page/r/google-review',
  googleFallbackCount: 0,
  googleFallbackRating: 0,
};

export default function useRuntimeConfig() {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    let active = true;
    fetchRuntimeConfig()
      .then(nextConfig => {
        if (active && nextConfig) setConfig(prev => ({ ...prev, ...nextConfig }));
      })
      .catch(() => {});

    return () => { active = false; };
  }, []);

  return config;
}
