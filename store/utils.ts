export const saveAuthState = (jwt: string) => ({
  jwt,
});

export const resetAuthState = () => ({
  jwt: undefined,
  session: undefined,
  isAuthenticated: false,
});
