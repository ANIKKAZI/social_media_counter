import { Capacitor } from '@capacitor/core';

// In the Android APK there is no backend, so data is fetched straight from the APIs.
// In the browser the Node server (which holds the secrets) is used instead.
export const isNativeApp = Capacitor.isNativePlatform();

export const NATIVE_POLL_INTERVAL_MS = 30_000;

export async function fetchInstagramProfile() {
  if (!isNativeApp) {
    const res = await fetch('/api/followers', { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
    return { username: data.username, followers: Number(data.followers) || 0, profilePictureUrl: data.profilePictureUrl || null };
  }

  const token = process.env.REACT_APP_INSTAGRAM_TOKEN;
  if (!token) throw new Error('Instagram token not configured. Set META_ACCESS_TOKEN in .env and rebuild the APK.');
  const res = await fetch(`https://graph.instagram.com/v25.0/me?fields=id,username,followers_count,profile_picture_url&access_token=${encodeURIComponent(token)}`);
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return { username: data.username, followers: Number(data.followers_count) || 0, profilePictureUrl: data.profile_picture_url || null };
}

export async function fetchGoogleReviews() {
  if (!isNativeApp) {
    const res = await fetch('/api/google-reviews', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
  const placeId = process.env.REACT_APP_GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) throw new Error('GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID must be set in .env and the APK rebuilt.');
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount' },
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(body.error?.message || `Google Places HTTP ${res.status}`);
  return {
    placeId: body.id || placeId,
    name: body.displayName?.text || '',
    rating: Number(body.rating) || 0,
    reviewCount: Number(body.userRatingCount) || 0,
  };
}

export async function fetchRuntimeConfig() {
  if (!isNativeApp) {
    const res = await fetch('/api/config', { cache: 'no-store' });
    return res.ok ? res.json() : null;
  }
  return {
    fallbackPollIntervalMs: NATIVE_POLL_INTERVAL_MS,
    googleReviewUrl: process.env.REACT_APP_GOOGLE_REVIEW_URL,
    googleFallbackCount: Number(process.env.REACT_APP_GOOGLE_REVIEW_COUNT) || 0,
    googleFallbackRating: Number(process.env.REACT_APP_GOOGLE_RATING) || 0,
  };
}
