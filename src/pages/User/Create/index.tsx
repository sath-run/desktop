import {
  ProFormText, ProFormCaptcha,
} from '@ant-design/pro-components';
import {Alert, Button, Form, message, Modal, Typography} from 'antd';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {createAccount, getCode} from "@/services/user";
import DIcon from "@/components/DIcon";
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

const CreateUser: React.FC<{
  visible: boolean,
  onCancel: () => any,
  onSuccess: () => any,
  onCommand: (cmd: 'createAccount' | 'resetPassword' | 'login') => any
}> = ({visible, onCancel, onSuccess, onCommand}) => {
  const [loginForm] = Form.useForm();
  const [error, setError] = useState('');
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values: API.CreateAccountParams & { confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      setError(t('user.passwordNotMatch'))
      return;
    }
    setLoading(true);
    try {
      const result = await createAccount({
        account: values.account,
        password: values.password,
        code: values.code,
        name: values.name,
      });
      setLoading(false)
      if (result.status === 200) {
        message.success(t('user.createUserSuccess'));
        onSuccess();
      } else {
        setError(result.msg);
      }
    } catch (error) {
      setLoading(false)
    }
  };
  return (
    <Modal className={styles.pageLogin} open={visible} footer={null} onCancel={onCancel} destroyOnClose>
      <Form
          preserve={false}
          className={styles.loginForm}
        initialValues={{}}
        form={loginForm}
        onFinish={async (values) => {
          await handleSubmit(values);
        }}
      >
        <div className={styles.topTitle}>
          <div className={styles.logo}>SATH</div>
          {t('user.topTitle')}
        </div>
        <ProFormText
          name='name'
          fieldProps={{
            size: 'large',
            prefix: <DIcon name={'icon-icon-person'}/>,
          }}
          placeholder={t('user.name')}
          rules={[
            {
              required: true,
              message: t('user.nameTip'),
            }
          ]}
        />
        <ProFormText
          name='account'
          fieldProps={{
            size: 'large',
            prefix: <DIcon name={'icon-mail'}/>,
          }}
          placeholder={t('user.email')}
          rules={[
            {
              required: true,
              message: t('user.emailTip'),
            },
            {
              type: 'email',
              message: t('user.invalidEmail'),
            }
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: <DIcon name={'yanzhengyanzhengma'}/>,
          }}
          captchaProps={{
            size: 'large',
          }}
          phoneName="account"
          name="code"
          rules={[
            {
              required: true,
              message: t('user.verifyCodeTip'),
            },
          ]}
          placeholder={t('user.verifyCode')}
          onGetCaptcha={async (email) => {
            loginForm.validateFields(['account']).then(async () => {
              const result = await getCode(email);
              if (result.status === 200) {
                message.success('验证码已发送到邮箱,请注意查收')
              } else {
                throw new Error(result.msg || '验证码发送失败')
              }
            })
          }}
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
        <ProFormText.Password
          name='confirmPassword'
          fieldProps={{
            size: 'large',
            prefix: <DIcon name={'mima'}/>,
          }}
          placeholder={t('user.confirmPassword')}
          rules={[
            {
              required: true,
              message: t('user.confirmPasswordTip')
            },
          ]}
        />
        {error && (<LoginMessage content={error}/>)}
        <Button className={styles.loginBtn} size={'large'} block type={'primary'}
                loading={loading} onClick={() => loginForm.submit()}>{t('user.registerBtn')}</Button>
        <div className={styles.loginFooter}>
          <Typography.Link className={styles.link} onClick={() => onCommand('login')}> {t('user.loginAccount')}</Typography.Link>
          <div className={styles.rightContent}>
            <Typography.Link className={styles.link} onClick={() => onCommand('resetPassword')}> {t('login.resetPassword')}</Typography.Link>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUser;
