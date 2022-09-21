import {
  ProFormText,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import {Alert, Button, Form, Modal, Typography} from 'antd';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import DIcon from "@/components/DIcon";
import {login} from '@/services/user';
import styles from './index.module.less';


const LoginMessage: React.FC<{ content: string }> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type='error'
    showIcon
  />
);

const Login: React.FC<{
  visible: boolean,
  onCancel: () => any,
  onSuccess: () => any,
  onCommand: (cmd: 'createAccount' | 'resetPassword' | 'login') => any
}> = ({visible, onCancel, onSuccess, onCommand}) => {
  const [loginForm] = Form.useForm();
  const [error, setError] = useState(false);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values: API.LoginParams & { autoLogin: boolean }) => {
    setLoading(true);
    const result = await login({account: values.account, password: values.password});
    setLoading(false)
    if (result.success) {
      onSuccess();
    } else {
      setError(true);
    }
  };
  return (
    <Modal className={styles.pageLogin} width={440} open={visible} footer={null} onCancel={onCancel}>
      <Form
        className={styles.loginForm}
        initialValues={{
          account: localStorage.getItem('account')
        }}
        form={loginForm}
        onFinish={async (values) => {
          await handleSubmit(values);
        }}
      >
        <div className={styles.title}>
          {/*<img alt='logo' src={LogoImg} />*/}
          <div className={styles.logo}>Screening@Home</div>
        </div>
        {error && (<LoginMessage content={t('login.passwordError')}/>)}
        <ProFormText
          name='account'
          fieldProps={{
            size: 'large',
            prefix: <DIcon name={'icon-mail'}/>,
          }}
          placeholder={t('login.account')}
          rules={[
            {
              required: true,
              message: t('login.accountTip'),
            },
          ]}
        />
        <ProFormText.Password
          name='password'
          fieldProps={{
            size: 'large',
            prefix: <DIcon name={'mima'}/>,
          }}
          placeholder={t('login.password')}
          rules={[
            {
              required: true,
              message: t('login.passwordTip')
            },
          ]}
        />
        <Button className={styles.loginBtn} size={'large'} block type={'primary'}
                loading={loading} onClick={() => loginForm.submit()}>{t('login.loginBtn')}</Button>
        <div className={styles.loginFooter}>
          <ProFormCheckbox noStyle name='autoLogin'>
            {t('login.rememberAccount')}
          </ProFormCheckbox>
          <div className={styles.rightContent}>
            <Typography.Link className={styles.link} onClick={() => onCommand('createAccount')}>{t('login.createAccount')}</Typography.Link>
            <Typography.Link className={styles.link} onClick={() => onCommand('resetPassword')}>{t('login.resetPassword')}</Typography.Link>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default Login;
