// @ts-check

export function requireENV(key) {
  const value = process.env[key];
  if (value != null) {
    return value;
  }

  throw new Error(`${key} missing in environment`);
}
