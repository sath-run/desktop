import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './style.less';
import App from './App';
import './locales';
import {platform} from "os";
type Platform =
  'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd';
window.electron.invoke('platform', (platform: Platform) => {
  window.platform = platform;
  console.info('platform:', window.platform)
})

const root = createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
