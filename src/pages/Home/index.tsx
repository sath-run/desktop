import Logo from '@/assets/imgs/logo.png';
import {useEffect, useState} from 'react';
import UserLogin from './components/Login';
import UserCreate from './components/Create';
import UserPassword from './components/Password';
import Description from './components/Description';
import {useToast, Link, Progress, Box, Text, SimpleGrid, Center, Flex} from '@chakra-ui/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination, Autoplay} from 'swiper';
import 'swiper/less';
import 'swiper/less/navigation';
import 'swiper/less/pagination';
import {PlayCircleFilled, PauseCircleFilled} from '@ant-design/icons';
import Styles from './index.module.less';
import NewsIcon from './img/single.png';


type Status = 'default' | 'waiting' | 'running' | 'complete' | 'noJob';
type SystemInfo = {
    cpu: number,
    memory: number
}
let taskId: NodeJS.Timer;

function Home() {
    const Toast = useToast();
    const [status, setStatus] = useState<Status>('default');
    const [percent, setPercent] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [score, setScore] = useState(100);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [userInfo, setUserInfo] = useState<API.CurrentUser>({} as API.CurrentUser);
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
        window.electron?.EventsOn('job-error', ({id}: { id: number }) => {

        });
        window.electron.invoke('startJob', {}, (result: API.Response<null>) => {
            console.info('result:', result);
            if (result.status === 200) {
                setStatus('running');
            } else {
                Toast({
                    title: '启动失败',
                    description: result.data,
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
        window.electron.invoke('stopJob', {}, () => {
        });
    };
    useEffect(() => {
        taskId = setInterval(() => {
            window.electron.invoke('systemInfo', {}, (result: { cpu: number, memory: number }) => {
                setSystemInfo(result);
            });
        }, 2000);
        return function cleanup() {
            window.electron?.EventsOff('progress');
            window.electron?.EventsOff('no-job');
            clearInterval(taskId);
        };
    }, []);
    const onCommand = (cmd: 'createAccount' | 'resetPassword' | 'login') => {
        setShowPassword(false);
        setShowLogin(false);
        setShowRegister(false);
        switch (cmd) {
            case 'createAccount':
                setShowRegister(true);
                break;
            case 'resetPassword':
                setShowPassword(true);
                break;
            case 'login':
                setShowLogin(true);
                break;
        }
    };
    return (<Box pl={120} pr={120} pt={30} pb={30}>
        <Box>
            <Center>
                <img width={120} height={120} src={Logo}/>
            </Center>
            <Center fontSize={20}>
                利用你的电脑与科学家一同发现治疗疾病的新药物
            </Center>
            {status === 'default' ?
                <Swiper className={Styles.newsList} pagination={true} modules={[Pagination, Autoplay]} autoplay={true}>
                    {newsList.map((news, index) => {
                        return <SwiperSlide key={`news_${index}`}>
                            <Flex className={Styles.news}>
                                <img width={240} src={news.img}/>
                                <Center className={Styles.news__title} fontSize={16} lineHeight={25}>
                                    <Box>{news.title}
                                        <Link color={'brand.500'} ml={5}
                                              onClick={() => setShowDescription(true)}>更多详情</Link>
                                    </Box>
                                </Center>
                            </Flex>
                        </SwiperSlide>
                    })}
                </Swiper> :
                <div className={Styles.statusContainer}>
                    <Box position={'relative'} pr={30} mb={20}>
                        <Progress colorScheme='blue' size='md' isAnimated value={percent} borderRadius={5}/>
                        <Text position={'absolute'} left={430} top={'50%'} transform={'translateY(-50%)'} fontWeight={'bold'} color={'brand.500'}>{Math.ceil(percent * 100) / 100}%</Text>
                    </Box>
                    <Text textAlign={'center'} fontSize={'16px'}>
                        正在计算蛋白质和小分子的结合活性，<Link color={'brand.500'}
                                                               onClick={() => setShowDescription(true)}>了解更多</Link>
                    </Text>
                    <Box className={Styles.totalData} borderRadius={10} borderWidth={1} borderColor={'gray.200'}>
                        <SimpleGrid columns={4} spacing={'10px'}>
                            <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                                <Text textAlign={'center'}>已完成任务</Text>
                                <Text fontSize={30} fontWeight={500} color='brand.500'>{jobCount}个</Text>
                                {/*<Statistic title={'已完成任务'} value={jobCount} suffix='个'/>*/}
                            </Box>
                            <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                                <Text textAlign={'center'}>已获得积分</Text>
                                <Text fontSize={30} fontWeight={500} color='brand.500'>{score}</Text>
                            </Box>
                            <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                                <Text textAlign={'center'}>CPU占用率</Text>
                                <Text fontSize={30} fontWeight={500} color='brand.500'>{systemInfo.cpu}%</Text>
                            </Box>
                            <Box height={100} textAlign={'center'} paddingTop={'20px'}>
                                <Text>内存占用率</Text>
                                <Text fontSize={30} fontWeight={500} color='brand.500'>{systemInfo.memory}%</Text>
                            </Box>
                        </SimpleGrid>
                    </Box>

                </div>
            }
            {['default', 'noJob'].includes(status) ? <PlayCircleFilled className={Styles.btnStart} onClick={onStart}/> :
                <PauseCircleFilled className={Styles.btnStop} onClick={onStop}/>}
            {!userInfo.name && <Center pt={50} fontSize={16}>
                <Link color={'brand.500'} onClick={() => {
                    setShowLogin(true);
                }}>登录账户</Link>,以便更好的保存你的计算积分
            </Center>}
        </Box>
        <UserLogin visible={showLogin} onCancel={() => setShowLogin(false)} onSuccess={() => {
            setShowLogin(false);
            setUserInfo({
                name: '2222',
                avatar: '',
            });
        }} onCommand={onCommand}/>
        <UserCreate visible={showRegister} onCancel={() => setShowRegister(false)} onSuccess={() => {
            setShowRegister(false);
            setShowLogin(true);
        }} onCommand={onCommand}/>
        <UserPassword visible={showPassword} onCancel={() => setShowPassword(false)} onSuccess={() => {
            setShowPassword(false);
            setShowLogin(true);
        }} onCommand={onCommand}/>
        <Description visible={showDescription} onCancel={() => setShowDescription(false)}/>
    </Box>);
}

export default Home;
