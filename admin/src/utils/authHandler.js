// Shared helper for admin pages: checks if an API response failed because
// the admin's session/token is expired or invalid, and if so, clears the
// stored token and forces the app back to the Login screen.
//
// Returns true if it handled an auth failure (caller should stop further
// processing / not show its own generic error toast), false otherwise.
export const handleAuthError = (message) => {
  if (!message) return false;

  const lower = message.toLowerCase();
  const isAuthError = lower.includes('login again') || lower.includes('session expired');

  if (isAuthError) {
    localStorage.removeItem('admin-token');
    window.location.reload();
    return true;
  }

  return false;
};
