import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './style.less';
import App from './App';
import './locales';
// import {MAC} from "@/constants";
// import {v4 as uuidV4} from 'uuid';
import {platform} from "os";

// try {
//     if(!localStorage.getItem(MAC)){
//         GetMac().then(mac => {
//             console.info('mac:', mac)
//             localStorage.setItem(MAC, mac.shift() || uuidV4());
//         })
//     }
// }catch (error){}
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
