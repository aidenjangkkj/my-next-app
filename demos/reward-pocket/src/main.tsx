import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import './styles.css'
import App from './App'
import BridgeDemo from './bridge/BridgeDemo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme accentColor="teal" grayColor="sage" radius="large" appearance="light">
      {new URLSearchParams(window.location.search).get('host') === '1' ? <BridgeDemo /> : <App />}
    </Theme>
  </StrictMode>,
)
