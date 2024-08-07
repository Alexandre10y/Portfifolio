import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Project from './Pages/Project';
import Dashboard from './Pages/Project/dashboard';
import { Route, Routes, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route exact path='/' Component={Home} />
          <Route path='/Home' Component={Home} />
          <Route path='/Project' Component={Project} />
          <Route path='/Dashboard' Component={Dashboard} />
        </Routes>
      </main>
      {location.pathname !== '/About' && <Footer />}
      <Routes>
        <Route path='/About' Component={About} />
      </Routes>
    </div>
  );
}

export default App;
