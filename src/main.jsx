import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx"; // Correct import
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

// Root wrapper that consumes AuthContext inside provider
const Root = () => {
  const { user } = React.useContext(AuthContext); // safe here because Root is inside AuthProvider
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
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>
);
