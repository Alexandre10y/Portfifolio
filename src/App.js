import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import RadarIa from './pages/radar-ia';
import SmoothScroll from './components/smoothScroll/SmoothScroll';
import PagePreloader from './components/ui/PagePreloader';

function App() {
  return (
    <BrowserRouter>
      <PagePreloader>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/radar-ia" element={<RadarIa />} />
          </Routes>
        </SmoothScroll>
      </PagePreloader>
    </BrowserRouter>
  );
}

export default App;
