import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import { appTheme } from './themes/theme';
import { Layout } from './components/Layout/Layout';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Snackbar } from './components/Shared/Snackbar';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <Snackbar />
      <Toaster /> {/* Add the Toaster component here */}
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
