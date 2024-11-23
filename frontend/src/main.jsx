import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
// import './index.css'

const root = createRoot(document.getElementById('root'));
import "@auth0/auth0-react"

root.render(
  <Auth0Provider
      domain="dev-ilhedbbhmkji2rij.us.auth0.com"
      clientId="11wnPlIvbKLr9cdBEvquzujkLcHVjknZ"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </Auth0Provider>,
  );
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//    root.render(
// <Auth0Provider
//     domain="dev-ilhedbbhmkji2rij.us.auth0.com"
//     clientId="11wnPlIvbKLr9cdBEvquzujkLcHVjknZ"
//     authorizationParams={{
//       redirect_uri: window.location.origin
//     }}
//   >
//     <App />
//   </Auth0Provider>,
// )
//   </StrictMode>,
// )
