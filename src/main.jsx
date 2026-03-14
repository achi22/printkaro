import React from 'react'
import ReactDOM from 'react-dom/client'
import PrintKaaro from './App.jsx'
import AdminDashboard from './Admin.jsx'
import './index.css'

function Router() {
  const [isAdmin, setIsAdmin] = React.useState(window.location.hash === "#admin");

  React.useEffect(() => {
    const handleHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return isAdmin ? <AdminDashboard /> : <PrintKaaro />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
