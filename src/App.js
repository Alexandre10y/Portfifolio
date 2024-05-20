import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Project from './Pages/Project';
import Dashboard from './Pages/Project/dashboard';
import { Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Header/>
      <main>
      <Routes>
          <Route exact path='/' Component={Home} />
          <Route path='/Home' Component={Home} />
          <Route path='/About' Component={About} />
          <Route path='/Project' Component={Project} />
          <Route path='/Dashboard' Component={Dashboard} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
