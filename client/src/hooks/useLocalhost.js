export function useLocalhost(isDevelopment) {
  const localHost = (isAuth) => {
    return isDevelopment ? `http://localhost:${isAuth ? "5000" : "4000"}` : ""
  }

  return {
    authServer: localHost(false),
    mainServer: localHost(true),
  }
}
