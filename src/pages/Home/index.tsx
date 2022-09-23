import Logo from '@/assets/imgs/logo.png';
import {Card, Carousel, Col, message, Progress, Row, Statistic, Typography} from "antd";
import {useEffect, useRef, useState} from "react";
import {PauseCircleFilled, PlayCircleFilled} from "@ant-design/icons";
import {JOB_STATUS, MY_JOB_LIST} from "@/constants";
import UserLogin from '@/pages/User/Login';
import UserCreate from '@/pages/User/Create';
import UserPassword from '@/pages/User/Password';
import Description from "@/pages/Description";
import Styles from './index.module.less';
import NewsIcon from './img/single.png';


type Status = 'default' | 'waiting' | 'running' | 'complete' | 'noJob';
type SystemInfo = {
  cpu: number,
  memory: number
}
let taskId: NodeJS.Timer;

function Home() {
  const [status, setStatus] = useState<Status>('default');
  const [percent, setPercent] = useState(0);
  const myJobList = useRef<API.TaskJob[]>([]);
  const [jobCount, setJobCount] = useState(0);
  const [score, setScore] = useState(100);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [userInfo, setUserInfo] = useState<API.CurrentUser>({} as API.CurrentUser)
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpu: 0,
    memory: 0,
  })
  const onStart = () => {
    setStatus('waiting');
    window.electron?.EventsOn("progress", (data: {
      status: string,
      progress: number
    }) => {
      console.info('progress:', data)
      setPercent(Math.ceil(data.progress*10)/10);
      if(data.status === 'success'){
        setJobCount(prevState => prevState + 1);
        setScore(prevState => prevState + 10);
      }
    })
    window.electron?.EventsOn("no-job", () => {
      setStatus('noJob');
    })
    window.electron?.EventsOn('job-error', ({id}: { id: number }) => {

    })
    window.electron.invoke('startJob', {}, (result: API.Response<null>) => {
      console.info('result:', result)
      if(result.status === 200){
        setStatus('running');
      }else{
        message.error(result.data);
        setStatus('default')
      }
    })
  }
  const newsList = [{
    title: '2022年09月03日，用户JIDJ帮助XXX药企发现了一款有可能用于减轻COVID症状的新药物',
    img: NewsIcon
  }, {
    title: '2022年08月15日，用户DDD帮助HHH药企发现了一款有可能用于减轻猴痘症状的新药物',
    img: NewsIcon
  }]
  const onStop = () => {
    setStatus('default');
    setPercent(0);
    window.electron?.EventsOff("progress");
    window.electron?.EventsOff("no-job");
    window.electron.invoke('stopJob', {}, () => {})
  }
  useEffect(() => {
    taskId = setInterval(() => {
      window.electron.invoke('systemInfo', {}, (result: { cpu: number, memory: number }) => {
        setSystemInfo(result)
      })
    }, 2000)
    const localJobList: API.TaskJob[] = JSON.parse(localStorage.getItem(MY_JOB_LIST) || '[]');
    let count = 0;
    localJobList.forEach(job => {
      if (job.status === JOB_STATUS.SUCCESS) {
        count++;
      }
    })
    myJobList.current = localJobList;
    setJobCount(count);
    return function cleanup() {
      window.electron?.EventsOff("progress");
      window.electron?.EventsOff("no-job");
      clearInterval(taskId);
    }
  }, [])
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
  }
  return (<div className={Styles.page}>
    <div className={Styles.pageTitle}>
      <img className={Styles.logo} src={Logo}/>
      <div className={Styles.desc}>利用你的电脑与科学家一同发现治疗疾病的新药物</div>
      {status === 'default' ?
        <Carousel className={Styles.newsList} autoplay effect={'fade'} dots={false} autoplaySpeed={5000}>
          {newsList.map((news, index) => {
            return <div key={`news_${index}`}>
              <div className={Styles.news}>
                <img className={Styles.news__img} src={news.img}/>
                <div className={Styles.news__title}>{news.title}<Typography.Link
                  style={{marginLeft: 5}} onClick={() => setShowDescription(true)}>更多详情</Typography.Link></div>
              </div>
            </div>
          })}
        </Carousel> :
        <div className={Styles.statusContainer}>
          <div className={Styles.progress}>
            <Progress percent={percent}/>
            <div className={Styles.progress__text}>
              正在计算蛋白质和小分子的结合活性，<Typography.Link
              onClick={() => setShowDescription(true)}>了解更多</Typography.Link>
            </div>
          </div>
          <Card className={Styles.totalData}>
            <Row gutter={30}>
              <Col span={6}>
                <Statistic title={'已完成任务'} value={jobCount} suffix="个"/>
              </Col>
              <Col span={6}>
                <Statistic title={'已获得积分'} value={score}/>
              </Col>
              <Col span={6}>
                <Statistic title={'CPU占用率'} value={systemInfo.cpu} suffix="%"/>
              </Col>
              <Col span={6}>
                <Statistic title={'内存占用率'} value={systemInfo.memory} suffix="%"/>
              </Col>
            </Row>
          </Card>

        </div>
      }
      {['default', 'noJob'].includes(status) ? <PlayCircleFilled className={Styles.btnStart} onClick={onStart}/> :
        <PauseCircleFilled className={Styles.btnStop} onClick={onStop}/>}
      {!userInfo.name && <div className={Styles.footer}>
        <Typography.Link onClick={() => {
          setShowLogin(true)
        }}>登录账户</Typography.Link>,以便更好的保存你的计算积分
      </div>}
    </div>
    <UserLogin visible={showLogin} onCancel={() => setShowLogin(false)} onSuccess={() => {
      setShowLogin(false);
      setUserInfo({
        name: '2222',
        avatar: '',
      })
    }} onCommand={onCommand}/>
    <UserCreate visible={showRegister} onCancel={() => setShowRegister(false)} onSuccess={() => {
      setShowLogin(false);
      setUserInfo({
        name: '2222',
        avatar: '',
      })
    }} onCommand={onCommand}/>
    <UserPassword visible={showPassword} onCancel={() => setShowPassword(false)} onSuccess={() => {
      setShowLogin(false);
      setUserInfo({
        name: '2222',
        avatar: '',
      })
    }} onCommand={onCommand}/>
    <Description visible={showDescription} onCancel={() => setShowDescription(false)}/>
  </div>)
}

export default Home
