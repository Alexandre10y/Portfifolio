import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home';
import SmoothScroll from './components/smoothScroll/SmoothScroll';

function App() {
  return (
    <SmoothScroll>
      <Home />
    </SmoothScroll>
  );
}

export default App;
