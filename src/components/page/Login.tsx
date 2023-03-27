import { localStorageKey, useTokenMutation } from '../../data-access'
import { FormDataRequest } from '../../data-access'
import { Button, Form, Input } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const { mutate, isLoading } = useTokenMutation()
  const navigate = useNavigate()
  const onFinishFailed = (e) => console.log(e)
  const onFinish = (values: FormDataRequest) =>
    mutate(values, {
      onSuccess: (data) => data && navigate('/dashboard'),
      onError: (error) => console.log(error),
    })

  useEffect(() => {
    if (localStorage.getItem(localStorageKey)) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ margin: 'auto' }}>
        <h3>Kizzi</h3>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
