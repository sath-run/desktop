import {Routes, Route, Navigate} from 'react-router-dom';
import Home from '@/pages/Home'
import Integral from "@/pages/Integral";
import {ConfigProvider} from "antd";
import {useTranslation} from "react-i18next";
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import {useEffect, useState} from "react";
import './App.less';
import MainLayout from "@/components/MainLayout";

function App() {
    const {i18n} = useTranslation();
    const [locale, setLocal] = useState(zhCN);
    useEffect(() => {
        setLocal(i18n.language == 'zh_CN' ? zhCN : enUS);
    }, [i18n.language])
    return <div id='App'>
        <ConfigProvider locale={locale}>
            <Routes>
                <Route path='*' element={<Navigate to="/main/home"/>}/>
                <Route path="/main" element={<MainLayout/>}>
                    <Route path={'/main/home'} element={<Home/>}/>
                    <Route path={'/main/integral'} element={<Integral/>}/>
                </Route>
            </Routes>
        </ConfigProvider>
    </div>;
}

export default App;
