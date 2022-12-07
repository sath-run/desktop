import {Routes, Route, Navigate} from 'react-router-dom';
import Home from '@/pages/Home';
import { Box, ChakraProvider } from '@chakra-ui/react';
import MainLayout from '@/components/MainLayout';
import {extendTheme} from '@chakra-ui/react';

const colors = {
    brand: {
        500: '#2496ed',
    },
}

const theme = extendTheme({ colors })

function App() {
    return <Box id='App' h={'full'} w={'full'}>
        <ChakraProvider theme={theme}>
            <Routes>
                <Route path='*' element={<Navigate to='/main/home'/>}/>
                <Route path='/main' element={<MainLayout/>}>
                    <Route path={'/main/home'} element={<Home/>}/>
                </Route>
            </Routes>
        </ChakraProvider>
    </Box>;
}

export default App;
