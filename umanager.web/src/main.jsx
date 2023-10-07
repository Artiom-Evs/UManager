import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root');
const root =  ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>);
