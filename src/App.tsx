import {Routes, Route, Navigate} from 'react-router-dom';
import Home from '@/pages/Home';
import {ChakraProvider} from '@chakra-ui/react';
import MainLayout from '@/components/MainLayout';
import {extendTheme} from '@chakra-ui/react';
import './App.less';

const colors = {
    brand: {
        500: '#2496ed',
    },
}

const theme = extendTheme({ colors })

function App() {
    // const {i18n} = useTranslation();
    return <div id='App'>
        <ChakraProvider theme={theme}>
            <Routes>
                <Route path='*' element={<Navigate to='/main/home'/>}/>
                <Route path='/main' element={<MainLayout/>}>
                    <Route path={'/main/home'} element={<Home/>}/>
                </Route>
            </Routes>
        </ChakraProvider>
    </div>;
}

export default App;
