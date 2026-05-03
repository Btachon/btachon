import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { getStoredJwt } from "@workspace/replit-auth-web";

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "");
if (apiUrl) setBaseUrl(apiUrl);
setAuthTokenGetter(getStoredJwt);

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
