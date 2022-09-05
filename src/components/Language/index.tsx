import {Dropdown, Menu} from "antd";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {LANGUAGE} from "@/constants";

const Language: React.FC<{ children: React.ReactNode, className?: string }> = ({children, className}) => {
    const {i18n} = useTranslation();
    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem(LANGUAGE, language);
        window.dispatchEvent(new Event('changeLanguage'))
    }
    return <Dropdown className={className} overlay={<Menu
        items={[
            {
                key: 'zh_CN',
                label: <a onClick={() => changeLanguage('zh_CN')}>中文</a>,
            },
            {
                key: 'en_US',
                label: <a onClick={() => changeLanguage('en_US')}>English</a>,
            }
        ]}
    />} placement='top' arrow>
        {children}
    </Dropdown>
}

export default Language;