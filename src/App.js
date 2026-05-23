import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home';
import SmoothScroll from './components/smoothScroll/SmoothScroll';
import PagePreloader from './components/ui/PagePreloader';

function App() {
  return (
    <PagePreloader>
      <SmoothScroll>
        <Home />
      </SmoothScroll>
    </PagePreloader>
  );
}

export default App;
