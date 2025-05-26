// import './App.css'; // This line is now removed
import { BrowserRouter } from 'react-router-dom';
import Inicio from './pages/layout';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import StoreProvider from './store';

function App() {
  // const [count, setCount] = useState(0) // Removed unused state

  return (
    <BrowserRouter>
      <StoreProvider>
        <Inicio />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
