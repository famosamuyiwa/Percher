export const saveAuthState = (jwt: string) => ({
  jwt,
});

export const resetAuthState = () => ({
  jwt: undefined,
  isAuthenticated: false,
});
