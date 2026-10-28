import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/home';
import RadarIa from './pages/radar-ia';
import SmoothScroll from './components/smoothScroll/SmoothScroll';
import PagePreloader from './components/ui/PagePreloader';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import FormacaoAdmin from './pages/admin/FormacaoAdmin';
import AtuacaoAdmin from './pages/admin/AtuacaoAdmin';
import SobreAdmin from './pages/admin/SobreAdmin';

function PublicShell() {
  return (
    <PagePreloader>
      <SmoothScroll>
        <Outlet />
      </SmoothScroll>
    </PagePreloader>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projetos" element={<ProjectsAdmin />} />
          <Route path="formacao" element={<FormacaoAdmin />} />
          <Route path="atuacao" element={<AtuacaoAdmin />} />
          <Route path="sobre" element={<SobreAdmin />} />
        </Route>

        <Route element={<PublicShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/radar-ia" element={<RadarIa />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
