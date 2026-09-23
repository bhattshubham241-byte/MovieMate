/*----- FILE: AuthContext.jsx | CONTENT: React authentication state and helper functions. | PURPOSE: Keeps the logged-in user available across MovieMate pages and stores the JWT token for protected requests. -----*/

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

/*----- AUTH STORAGE: These keys keep authentication information in the browser between page refreshes. -----*/
const TOKEN_KEY = "moviemateToken";
const USER_KEY = "moviemateUser";

function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    return savedUser ? JSON.parse(savedUser) : null;
  });

  /*----- LOGIN: Saves the token and user returned by the backend. -----*/
  const login = (authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authData.user)
    );

    setToken(authData.token);
    setUser(authData.user);
  };

  /*----- LOGOUT: Removes authentication information from the browser. -----*/
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
