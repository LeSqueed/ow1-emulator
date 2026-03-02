import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css'

import './utils/dayjs';
import './styles/index.css'
import './App.css'

import React from 'react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
