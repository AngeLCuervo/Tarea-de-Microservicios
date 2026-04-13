import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

// These should be configured in your .env file
const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-placeholder.us.auth0.com";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "PLACEHOLDER_CLIENT_ID";
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || "https://api.twitterlike.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "read:posts write:posts read:profile openid profile email"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
