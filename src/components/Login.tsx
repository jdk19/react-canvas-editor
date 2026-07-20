import Modal from "antd/es/modal/Modal";
import { Button } from "antd";
import { Form, Input, Checkbox } from 'antd';
import { login, logout } from "src/request/user";
import docCookies from "src/utils/cookies";
import { register } from "src/request/register";

const Login : React.FC = () => {
	const auth = docCookies.getItem('sessionId');
	const name = docCookies.getItem('name');
	
	console.log(auth, name);	

	const handleOk = () => {
		window.location.reload();	
	}
	
	if(auth) {
		return (
			<Button onClick={() => { logout(handleOk); }}>
				{name} 退出登录
			</Button>
		)
	}

  const onFinish = ({
    name,
    password,
    register_login,
  }: {
    name: string;
    password: string;
    register_login: boolean;
  }) => {
    console.log("Success:", {name, password, register_login});

    if (register_login) {
      registerAndLogin({name, password});
    } else {
      login({name, password}, () => {
        handleOk();
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const registerAndLogin = (values: {name: string; password: string}) => {
    register(values, () => {
      login(values, () => {
        handleOk();
      });
    });
  };

	return (
		<Modal title="注册并登录" closable={false} open={true} footer={null}>
			<p>登录后才能使用</p>
			<Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
			>
				<Form.Item
          label="用户名"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}>
          <Input />
        </Form.Item>
				<Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="register_login"
          valuePropName="checked"
          wrapperCol={{offset: 7}}>
          <Checkbox className="red">注册并登录</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
			</Form>
		</Modal>
	)
}

export default Login;
