import { MainLogo } from '../../components/layout'
import { MainContainer } from '../../components/layout/MainContainer'
import {
  FormDataRequest,
  localStorageKey,
  useTokenMutation,
} from '../../data-access'
import TestTubeImage from './test-tube.png'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

export const Login = () => {
  const { toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const { mutate, isLoading } = useTokenMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRequest>()
  const onLogin = (data) => {
    mutate(data, {
      onSuccess: (token) => {
        token && navigate('/')
      },
    })
  }
  useEffect(() => {
    if (localStorage.getItem(localStorageKey)) navigate('/dashboard')
  }, [])

  return (
    <MainContainer>
      {/* Left */}
      <Flex
        direction="column"
        bgColor="brand.100"
        py={20}
        roundedLeft="base"
        minW="xs"
        w="sm"
        display={{ base: 'none', md: 'flex' }}
        justifyContent="center"
      >
        <Image src={TestTubeImage} />
      </Flex>
      {/* Right */}
      <Box py={6} px={14} w="lg">
        <Flex h="full" direction="column">
          <MainLogo onClick={toggleColorMode} />
          <Heading textAlign="center" pb={8}>
            Sign in to Kizzi
          </Heading>
          <Box maxW="md" w="full" alignSelf="center">
            <form onSubmit={handleSubmit(onLogin)}>
              <Stack direction="column" spacing={4}>
                <Input
                  {...register('username', { required: true })}
                  autoComplete="username"
                  placeholder="Your email"
                  isInvalid={!!errors?.username}
                  variant="flushed"
                  colorScheme="green"
                />
                <Input
                  {...register('password', { required: true })}
                  autoComplete="current-password"
                  type="password"
                  placeholder="Your password"
                  isInvalid={!!errors?.password}
                  variant="flushed"
                />
                <HStack spacing={2} py={2} width="full">
                  <Box width="100%">
                    <Button
                      type="submit"
                      colorScheme="green"
                      isLoading={isLoading}
                      w="full"
                    >
                      Login
                    </Button>
                  </Box>
                </HStack>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Box>
    </MainContainer>
  )
}

const Additional = () => (
  <>
    <Flex align="center">
      <Divider />
      <Text px={10}>or</Text>
      <Divider />
    </Flex>
    <Flex direction="column">
      <Text align="center" fontSize="sm" color="gray.600" my={6}>
        <Link as={RouterLink} to="/forgot">
          Forgot your password?
        </Link>
      </Text>
    </Flex>
    <Text align="center" fontSize="sm" color="gray.600" my={6}>
      New here?&nbsp;
      <Link as={RouterLink} to="/create-account">
        Create an account
      </Link>
    </Text>
  </>
)
