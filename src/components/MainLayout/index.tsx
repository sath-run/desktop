import {useOutlet} from 'react-router-dom';
import {Box, Center} from '@chakra-ui/react';

const MainLayout = () => {
    const outlet = useOutlet();
    return (
        <Box pt={'40px'}>
            <Center style={{appRegion: 'drag'}} height={'40px'} position={'fixed'} fontSize={16} color={'whiteAlpha.900'} fontWeight={'700'} top={0} left={0} right={0} backgroundColor={'brand.500'}>
                SATH
            </Center>
            {outlet}
        </Box>
    );
};

export default MainLayout;
