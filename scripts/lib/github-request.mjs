// @ts-check
import fetch from 'isomorphic-fetch';
import { requireENV } from './require-env.mjs';

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
