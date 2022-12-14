import Logo from '@/assets/imgs/logo.png';
import { useEffect, useState } from 'react';
import UserLogin from './components/Login';
import Description from './components/Description';
import {
  useToast,
  Link,
  Progress,
  Box,
  Text,
  SimpleGrid,
  Center,
  Grid, Heading
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper';
import 'swiper/less';
import 'swiper/less/navigation';
import 'swiper/less/pagination';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import NewsIcon from './img/single.png';
import { request } from '@/utils/net';
import { login } from '@/services/user';
import { useTranslation } from 'react-i18next';

type Status = 'default' | 'waiting' | 'running' | 'complete' | 'noJob';
type SystemInfo = {
  cpu: number,
  memory: number
}
let taskId: NodeJS.Timer;

function Home() {
  const Toast = useToast();
  const {t} = useTranslation();
  const [status, setStatus] = useState<Status>('default');
  const [percent, setPercent] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [score, setScore] = useState(100);
  const [showLogin, setShowLogin] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [loginInfo, setLoginInfo] = useState<API.LoginInfo>({} as API.LoginInfo);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpu: 0,
    memory: 0,
  });
  const onStart = () => {
    setStatus('waiting');
    window.electron?.EventsOn('progress', (data: {
      status: string,
      progress: number
    }) => {
      console.info('progress:', data);
      setPercent(data.progress);
      if (data.status === 'success') {
        setJobCount(prevState => prevState + 1);
        setScore(prevState => prevState + 10);
      }
    });
    window.electron?.EventsOn('no-job', () => {
      setStatus('noJob');
    });
    window.electron?.EventsOn('job-error', ({ id }: { id: number }) => {});
    request<{ message: string }>({
      url: `${ENGINE_API}/services/start`,
      method: 'POST'
    }).then(result => {
      console.info('result:', result);
      if ([200, 201].includes(result.status)) {
        setStatus('running');
        window.electron.invoke('startListener', {}, () => {});
      } else {
        Toast({
          title: '启动失败',
          description: result.data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setStatus('default');
      }
    });
  };
  const newsList = [{
    title: '2022年09月03日，用户JIDJ帮助XXX药企发现了一款有可能用于减轻COVID症状的新药物',
    img: NewsIcon,
  }, {
    title: '2022年08月15日，用户DDD帮助HHH药企发现了一款有可能用于减轻猴痘症状的新药物',
    img: NewsIcon,
  }];
  const onStop = () => {
    setStatus('default');
    setPercent(0);
    window.electron?.EventsOff('progress');
    window.electron?.EventsOff('no-job');
    request({ url: `${ENGINE_API}/services/stop`, method: 'POST' });
  };
  const getToken = () => {
    request<API.LoginInfo>(`${ENGINE_API}/users/token`).then(result => {
      console.info('result:', result)
      if (result.status === 200) {
        setLoginInfo(result.data || {});
      }
    });
  };
  useEffect(() => {
    getToken();
    taskId = setInterval(() => {
      window.electron.invoke('systemInfo', {}, (result: { cpu: number, memory: number }) => {
        setSystemInfo(result);
      });
    }, 2000);
    window.electron?.EventsOn('openLogin', () => {
      !loginInfo.isUser && setShowLogin(true);
    })
    window.electron?.EventsOn('autoLogin', async ({token}:{token: string}) => {
      console.info('token:', token)
      const [email, password] = window.atob(token).split('##');
      const result = await login({ email, password });
      console.info('result:', result)
      if (result.status === 200) {
        getToken();
        setTimeout(() => {
          getToken();
        }, 10000)
      }
    })
    return function cleanup() {
      window.electron?.EventsOff('progress');
      window.electron?.EventsOff('no-job');
      window.electron?.EventsOff('login');
      clearInterval(taskId);
    };
  }, []);
  const onCommand = (cmd: 'createAccount' | 'resetPassword' | 'login') => {
    setShowLogin(false);
    switch (cmd) {
      case 'createAccount':
        window.electron.invoke('openUrl', 'https://www.sath.run/user/create');
        break;
      case 'resetPassword':
        window.electron.invoke('openUrl', 'https://www.sath.run/user/password');
        break;
      case 'login':
        setShowLogin(true);
        break;
    }
  };
  return (<Box px={100} py={30}>
    <Box>
      <Center>
        <img width={120} height={120} src={Logo} />
      </Center>
      <Center><Heading size={'lg'} mt={5} textAlign={'center'}>
        {t('main.title')}
      </Heading>
      </Center>
      {status === 'default' ?
        <Box mt={'50px'}><Swiper pagination={true} modules={[Pagination, Autoplay]} autoplay={true}>
          {newsList.map((news, index) => {
            return <SwiperSlide key={`news_${index}`}>
              <Grid cursor={'pointer'} gridTemplateColumns={'240px 1fr'}>
                <img width={240} src={news.img} />
                <Center ml={'20px'}>
                  <Box lineHeight={'25px'} fontSize={16}>{news.title}
                    <Link color={'brand.500'} ml={5}
                          onClick={() => setShowDescription(true)}>更多详情</Link>
                  </Box>
                </Center>
              </Grid>
            </SwiperSlide>;
          })}
        </Swiper></Box> :
        <Box w={'550px'} mt={'50px'} mx={'auto'}>
          <Box position={'relative'} pr={'30px'} mb={'10px'}>
            <Progress colorScheme="blue" mb={'20px'} size="md" isAnimated value={percent} borderRadius={5} />
            <Text position={'absolute'} left={'530px'} top={'50%'} transform={'translateY(-50%)'} fontWeight={'bold'} color={'brand.500'}>{Math.ceil(percent * 100) / 100}%</Text>
          </Box>
          <Center fontSize={'16px'}>
            {t('main.working')}
          </Center>
          <Center fontSize={'16px'}>
            <Link color={'brand.500'} onClick={() => setShowDescription(true)}>{t('main.more')}</Link>
          </Center>
          <Box mt={'40px'} borderRadius={10} borderWidth={1} borderColor={'gray.200'}>
            <SimpleGrid columns={4} spacing={'10px'}>
              <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                <Text textAlign={'center'}>{t('main.taskCompleted')}</Text>
                <Text fontSize={30} fontWeight={500} color="brand.500">{jobCount}</Text>
              </Box>
              <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                <Text textAlign={'center'}>{t('main.points')}</Text>
                <Text fontSize={30} fontWeight={500} color="brand.500">{score}</Text>
              </Box>
              <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                <Text textAlign={'center'}>{t('main.cpuUsage')}</Text>
                <Text fontSize={30} fontWeight={500} color="brand.500">{systemInfo.cpu}%</Text>
              </Box>
              <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                <Text>{t('main.memoryUsage')}</Text>
                <Text fontSize={30} fontWeight={500} color="brand.500">{systemInfo.memory}%</Text>
              </Box>
            </SimpleGrid>
          </Box>

        </Box>
      }
      {['default', 'noJob'].includes(status) ?
        <Center><Box _hover={{ opacity: 0.9 }} mt={'80px'} cursor={'pointer'} w={'80px'} h={'80px'} fontSize={'80px'} color={'brand.500'} onClick={onStart}><PlayCircleFilled /></Box></Center> :
        <Center><Box cursor={'pointer'} mt={'80px'} w={'80px'} h={'80px'} fontSize={'80px'} color={'red.500'} onClick={onStop}><PauseCircleFilled /></Box></Center>}
      {!loginInfo.isUser && <Center pt={50} fontSize={16}>
          <Link cursor={'pointer'} color={'brand.500'} onClick={() => {
            setShowLogin(true);
          }}>{t('main.signIn')}</Link>,{t('main.signInDesc')}
      </Center>}
    </Box>
    <UserLogin visible={showLogin} onCancel={() => setShowLogin(false)} onSuccess={() => {
      setShowLogin(false);
      getToken();
    }} onCommand={onCommand} />
    <Description visible={showDescription} onCancel={() => setShowDescription(false)} />
  </Box>);
}

export default Home;
