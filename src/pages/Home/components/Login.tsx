import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { login } from '@/services/user';
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
  InputProps, useToast, SimpleGrid, Link, Box,
  Checkbox, Text, InputRightElement, InputGroup,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Formik, Form, Field, FormikProps, FormikErrors, FieldMetaProps } from 'formik';
import { ACCOUNT } from '@/constants';

type FieldProps = {
  field: InputProps,
  form: FormikProps<API.LoginParams>,
  meta: FieldMetaProps<API.LoginParams>
}

const Login: React.FC<{
  visible: boolean,
  onCancel: () => any,
  onSuccess: () => any,
  onCommand: (cmd: 'createAccount' | 'resetPassword' | 'login') => any
}> = ({ visible, onCancel, onSuccess, onCommand }) => {
  const Toast = useToast();
  const [error, setError] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values: API.LoginParams) => {
    if (autoLogin) {
      localStorage.setItem(ACCOUNT, values.email);
    }
    setError('');
    setLoading(true);
    const result = await login({ email: values.email, password: values.password });
    setLoading(false);
    if (result.status === 200) {
      Toast({
        title: t('login.success'),
        status: 'success',
        duration: 3000,
        isClosable: false,
      });
      onSuccess();
    } else {
      setError(result.data.message);
    }
  };
  return (
    <Modal isOpen={visible} onClose={onCancel} size={'sm'} isCentered={true}>
      <ModalOverlay />
      <ModalContent pb={30}>
        <ModalCloseButton />
        <ModalHeader>{t('login.loginTitle')}</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              email: localStorage.getItem(ACCOUNT) || '',
              password: '',
            }}
            validate={values => {
              const errors: FormikErrors<API.LoginParams> = {};
              if (!values.email) {
                errors.email = t('login.accountTip');
              } else if (!values.password) {
                errors.password = t('login.passwordTip');
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
              <Field name="email" type={'email'}>
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={meta.touched && !!form.errors.email}>
                    <FormLabel>{t('login.account')}<Text display={'inline-block'}
                                                         color={'red.500'}>*</Text></FormLabel>
                    <Input {...field} placeholder={t('login.accountTip')} />
                    <FormErrorMessage>{form.errors.email || ''}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" type={'password'}>
                {({
                  field,
                  form,
                  meta,
                }: FieldProps) => (
                  <FormControl mt={5} isInvalid={meta.touched && !!form.errors.password}>
                    <FormLabel>{t('login.password')}<Text display={'inline-block'}
                                                          color={'red.500'}>*</Text></FormLabel>
                    <InputGroup>
                      <Input {...field} type={showPassword ? 'text' : 'password'} placeholder={t('login.passwordTip')} />
                      <InputRightElement h={'full'}>
                        <Button
                          variant={'ghost'}
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {meta.touched &&
                        <FormErrorMessage>{form.errors.password || ''}</FormErrorMessage>}
                  </FormControl>
                )}
              </Field>
              {error && <Alert status="error" mt={5}>
                  <AlertIcon />
                {error}
              </Alert>}
              <Checkbox mt={5}
                        onChange={e => setAutoLogin(e.target.checked)}>{t('login.rememberAccount')}</Checkbox>
              <Button
                mt={8}
                height={45}
                colorScheme={'blue'}
                width={'100%'}
                isLoading={loading}
                type="submit">
                {t('login.loginBtn')}
              </Button>
              <SimpleGrid columns={2} mt={5}>
                <Box textAlign={'left'}>
                  <Link color={'brand.500'}
                        onClick={() => onCommand('createAccount')}>{t('login.createAccount')}</Link>
                </Box>
                <Box textAlign={'right'}>
                  <Link color={'brand.500'}
                        onClick={() => onCommand('resetPassword')}>{t('login.resetPassword')}</Link>
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
