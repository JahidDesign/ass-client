import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthContextProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

// Wrapper to provide user from AuthContext to ThemeProvider
const Root = () => {
  const { user } = React.useContext(AuthContext); // use AuthContext, not provider
  return (
    <ThemeProvider user={user}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Root />
    </AuthContextProvider>
  </React.StrictMode>
);
