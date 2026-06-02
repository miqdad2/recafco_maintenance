const internalUsernameDomain = "recafco.local";

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function usernameToInternalEmail(username: string) {
  const normalized = normalizeUsername(username);
  if (!/^[a-z0-9._-]{3,40}$/.test(normalized)) {
    throw new Error("Username must be 3-40 characters using letters, numbers, dot, underscore, or dash.");
  }

  return `${normalized}@${internalUsernameDomain}`;
}
