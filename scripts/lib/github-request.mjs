// @ts-check
import fetch from 'isomorphic-fetch';
import { requireENV } from './require-env.mjs';

export const TIME_BETWEEN_REQUESTS = (3600 / 5000) * 1000; // Limited to 5000 requests/hour to the github API

/**
 * @param {string} endpoint
 */
export function githubRequest(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint}`;
  return fetch(url, {
    headers: {
      Authorization: `token ${requireENV('GITHUB_TOKEN')}`,
    },
  });
}
