import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {createAccount, getCode, updatePassword} from '@/services/user';
import {
    Alert,
    AlertIcon,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody, ModalHeader,
    ModalOverlay,
    ModalContent, ModalCloseButton, Button,
    InputProps, useToast, SimpleGrid, Link, Box, InputRightElement, InputGroup,
} from '@chakra-ui/react';
import {Formik, Form, Field, FormikProps, FormikErrors, FieldMetaProps} from 'formik';

type FormProps = API.CreateAccountParams & { confirmPassword: string };

type FieldProps = {
    field: InputProps,
    form: FormikProps<API.CreateAccountParams & { confirmPassword: string }>,
    meta: FieldMetaProps<API.CreateAccountParams & { confirmPassword: string }>
}

const Login: React.FC<{
    visible: boolean,
    onCancel: () => any,
    onSuccess: () => any,
    onCommand: (cmd: 'createAccount' | 'resetPassword' | 'login') => any
}> = ({visible, onCancel, onSuccess, onCommand}) => {
    const Toast = useToast();
    const [error, setError] = useState('');
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [countDown, setCountDown] = useState(60);
    const taskId = useRef<any>();
    const handleSubmit = async (values: FormProps) => {
        try {
            const result = await createAccount({
                name: values.name,
                account: values.account,
                password: values.password,
                code: values.code,
            });
            setLoading(false);
            if (result.status === 200) {
                Toast({
                    title: t('user.createUserSuccess'),
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                });
                onSuccess();
            } else {
                setError(result.msg);
            }
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {
        return () => {
            clearInterval(taskId.current);
        };
    }, []);
    return (
        <Modal isOpen={visible} onClose={onCancel} size={'sm'} isCentered={true}>
            <ModalOverlay/>
            <ModalContent pb={30}>
                <ModalCloseButton/>
                <ModalHeader>{t('user.topTitle')}</ModalHeader>
                <ModalBody>
                    <Formik
                        initialValues={{
                            name: '',
                            account: '',
                            code: '',
                            password: '',
                            confirmPassword: '',
                        } as FormProps}
                        validate={values => {
                            const errors: FormikErrors<FormProps> = {};
                            if (!values.name) {
                                errors.name = t('user.nameTip');
                            } else if (!values.account) {
                                errors.account = t('login.accountTip');
                            } else if (!values.code) {
                                errors.code = t('user.verifyCodeTip');
                            } else if (!values.password) {
                                errors.password = t('login.passwordTip');
                            } else if (!values.confirmPassword) {
                                errors.confirmPassword = t('user.confirmPasswordTip');
                            } else if (values.password !== values.confirmPassword) {
                                errors.confirmPassword = t('user.passwordNotMatch');
                            } else {
                                setError('');
                            }
                            return errors;
                        }}
                        onSubmit={async (values) => {
                            await handleSubmit(values);
                        }}
                    >
                        <Form>
                            <Field name='name'>
                                {({field, form, meta}: FieldProps) => (
                                    <FormControl isInvalid={meta.touched && !!form.errors.name}>
                                        <FormLabel>{t('user.name')}:</FormLabel>
                                        <Input {...field} placeholder={t('user.nameTip')}/>
                                        {meta.touched && <FormErrorMessage>{form.errors.name}</FormErrorMessage>}
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='account' type={'email'}>
                                {({field, form, meta}: FieldProps) => (
                                    <FormControl mt={5} isInvalid={meta.touched && !!form.errors.account}>
                                        <FormLabel>{t('login.account')}:</FormLabel>
                                        <Input {...field} placeholder={t('login.accountTip')}/>
                                        {meta.touched && <FormErrorMessage>{form.errors.account}</FormErrorMessage>}
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='code'>
                                {({field, form, meta}: FieldProps) => (
                                    <FormControl mt={5} isInvalid={meta.touched && !!form.errors.code}>
                                        <FormLabel>{t('user.verifyCode')}:</FormLabel>
                                        <InputGroup>
                                            <Input {...field} placeholder={t('user.verifyCodeTip')}/>
                                            <InputRightElement width={'auto'}>
                                                <Button colorScheme='blue'
                                                        variant='ghost' onClick={async () => {
                                                    if (form.values.account && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(form.values.account)) {
                                                        setSending(true);
                                                        const result = await getCode(form.values.account);
                                                        console.info('result:', result);
                                                        if (result.status === 200) {
                                                            Toast({
                                                                title: t('user.sendCodeSuccess'),
                                                                status: 'success',
                                                                duration: 3000,
                                                                isClosable: false,
                                                            });
                                                            taskId.current = setInterval(() => {
                                                                setCountDown(prevState => {
                                                                    if (prevState === 0) {
                                                                        clearInterval(taskId.current);
                                                                        return 60;
                                                                    }
                                                                    return prevState - 1;
                                                                });
                                                            }, 1000);
                                                        } else {
                                                            setSending(false);
                                                            Toast({
                                                                title: result.msg || '验证码发送失败',
                                                                status: 'error',
                                                                duration: 3000,
                                                                isClosable: false,
                                                            });
                                                        }
                                                    }
                                                }}
                                                >{sending ? `${countDown}秒后发送` : t('user.getVerifyCode')}</Button>
                                            </InputRightElement>
                                        </InputGroup>
                                        {meta.touched &&
                                            <FormErrorMessage>{form.errors.code}</FormErrorMessage>}
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='password' type={'password'}>
                                {({field, form, meta}: FieldProps) => (
                                    <FormControl mt={5} isInvalid={meta.touched && !!form.errors.password}>
                                        <FormLabel>{t('login.password')}:</FormLabel>
                                        <Input {...field} placeholder={t('login.passwordTip')}/>
                                        {meta.touched &&
                                            <FormErrorMessage>{form.errors.password || ''}</FormErrorMessage>}
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='confirmPassword' type={'password'}>
                                {({field, form, meta}: FieldProps) => (
                                    <FormControl mt={5} isInvalid={meta.touched && !!form.errors.confirmPassword}>
                                        <FormLabel>{t('user.confirmPassword')}:</FormLabel>
                                        <Input {...field} placeholder={t('user.confirmPasswordTip')}/>
                                        {meta.touched &&
                                            <FormErrorMessage>{form.errors.confirmPassword || ''}</FormErrorMessage>}
                                    </FormControl>
                                )}
                            </Field>
                            {error && <Alert status='error' mt={5}>
                                <AlertIcon/>
                                {error}
                            </Alert>}
                            <Button
                                mt={8}
                                height={45}
                                colorScheme={'blue'}
                                width={'100%'}
                                isLoading={loading}
                                type='submit'>
                                {t('user.confirmBtn')}
                            </Button>
                            <SimpleGrid columns={2} mt={5}>
                                <Box textAlign={'left'}>
                                    <Link color={'brand.500'}
                                          onClick={() => onCommand('login')}>{t('user.loginAccount')}</Link>
                                </Box>
                                <Box textAlign={'right'}>
                                    <Link color={'brand.500'}
                                          onClick={() => onCommand('createAccount')}>{t('login.createAccount')}</Link>
                                </Box>
                            </SimpleGrid>
                        </Form>
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default Login;
