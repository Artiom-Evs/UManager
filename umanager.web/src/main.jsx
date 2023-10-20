import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HashRouter } from 'react-router-dom'

const rootElement = document.getElementById('root');
const root =  ReactDOM.createRoot(rootElement);

root.render(
  <HashRouter basename="/">
    <App />
  </HashRouter>);
