import React, {useCallback, useState} from "react";
import { Menu} from "antd";
import {useNavigate, useOutlet} from "react-router-dom";
import {ProLayout} from "@ant-design/pro-components";
import DIcon from "@/components/DIcon";
import type {MenuInfo} from 'rc-menu/lib/interface';
import {GlobalOutlined, LogoutOutlined} from "@ant-design/icons";
import HeaderDropdown from "@/components/HeaderDropdown";
import styles from './index.module.less';
import {TOKEN} from "@/constants";
import {useTranslation} from "react-i18next";
import Language from "@/components/Language";
import KeepAlive from "@/components/KeepLive";
import classNames from "classnames";

const DLayout: React.FC = () => {
    const [pathname, setPathname] = useState('/main/home');
    const navigate = useNavigate();
    const {t} = useTranslation();
    const outlet = useOutlet()
    const [userName] = useState('');
    const menuList = [
        {name: t('menu.home'), path: '/main/home', icon: <DIcon name={'icon-shouye'}/>},
        {name: t('menu.algo'), path: '/main/algo', icon: <DIcon name={'icon-apppai'}/>},
        {name: t('menu.job'), path: '/main/job', icon: <DIcon name={'icon-job'}/>},
        {name: t('menu.integral'), path: '/main/integral', icon: <DIcon name={'icon-jifen'}/>},
        {name: t('menu.monitor'), path: '/main/monitor', icon: <DIcon name={'icon-jiankongguanlishebei'}/>}
    ]
    const onMenuClick = useCallback(
        (event: MenuInfo) => {
            const {key} = event;
            if (key === 'logout') {
                localStorage.removeItem(TOKEN)
                navigate({pathname: '/user/login'})
                return;
            }
        },
        [],
    );
    const cacheKeys: {[key: string]: string} = {};
    menuList.forEach(menu => {
        cacheKeys[menu.path] = menu.path;
    })
    return (
        <>
            <ProLayout
                route={{routes: menuList}}
                className={styles.layout}
                location={{
                    pathname,
                }}
                title={false}
                {...{
                    "navTheme": "light",
                    "primaryColor": "#2496ed",
                    "layout": "mix",
                    "contentWidth": "Fluid",
                    "fixedHeader": true,
                    "fixSiderbar": true,
                    "pwa": false,
                    "logo": false,
                    "headerHeight": 48,
                    "splitMenus": false
                }}
                headerContentRender={() => <div className={styles.appTitle}>SATH</div>}
                menuItemRender={(item, dom) => (
                    <a onClick={() => {
                        setPathname(item.path || '/main/home');
                        navigate({pathname: item.path})
                    }}>
                        {dom}
                    </a>
                )}
                rightContentRender={() => (
                    <div className={classNames(styles.rightContent, window.platform === 'win32' ? styles.win32 : null)}>
                        {/*<DIcon className={styles.settingBtn} size={18} name={'icon-shezhitianchong'}/>*/}
                        <Language><GlobalOutlined className={styles.languageBtn}/></Language>
                        {userName ? <HeaderDropdown
                                trigger={['click']}
                                overlay={<Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={[
                                    {
                                        key: 'logout',
                                        icon: <LogoutOutlined/>,
                                        label: t('user.loginOut'),
                                    }
                                ]}/>}>
                                <div className={styles.account}>
                                    <span className={styles.name}>{t('login.loginBtn')}</span>
                                    <DIcon className={styles.userIcon} size={20} name={'icon-yonghu'}/>
                                </div>
                            </HeaderDropdown> :
                            <div className={styles.account} onClick={() => navigate({pathname: '/user/login'})}>
                                <span className={styles.name}>{t('login.loginBtn')}</span>
                                <DIcon className={styles.userIcon} size={20} name={'icon-yonghu'}/>
                            </div>}
                    </div>
                )}
            >
                <KeepAlive include={menuList.map(menu => menu.path)} keys={cacheKeys}>
                    {outlet}
                </KeepAlive>
            </ProLayout>
        </>
    );
}

export default DLayout;
