import React, {useCallback} from 'react';
import {KeyOutlined, LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Input, Menu, Modal, Spin, message, Form} from 'antd';
import {history, useModel} from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {loginOut} from "@/utils/authority";
import {request_post} from "@/utils/request_tool";

const AvatarDropdown = ({menu}) => {
  let password_info = {
    password: '',
    confirm_password: '',
  }
  const {initialState, setInitialState} = useModel('@@initialState');
  const onMenuClick = useCallback(
    (event) => {
      const {key} = event;

      switch (key) {
        case 'logout':
          setInitialState((s) => ({...s, currentUser: undefined}));
          loginOut()
          break;
        case 'changPassword':
          Modal.confirm({
            icon: false,
            title: '修改密码',
            content: <div>
              <Form>
                <Form.Item style={{marginTop: 20}}>
                  <Input.Password
                    placeholder='请输入密码'
                    onChange={event => {
                      password_info.password = event.target.value
                    }}
                  />
                </Form.Item>
                <Form.Item required>
                  <Input.Password
                    placeholder='请输入确认密码'
                    onChange={event => {
                      password_info.confirm_password = event.target.value
                    }}
                  />
                </Form.Item>
              </Form>
            </div>,
            onOk: (e) => {
              request_post('/api/auth/editPassword', password_info).then(res => {
                if (res.code === 200) {
                  e()
                  message.success(res.message)
                  loginOut()
                }
              })
            }
          })
          break;
      }

    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const {currentUser} = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/*{menu && (*/}
      {/*  <Menu.Item key="center">*/}
      {/*    <UserOutlined/>*/}
      {/*    个人中心*/}
      {/*  </Menu.Item>*/}
      {/*)}*/}
      {/*{menu && (*/}
      {/*  <Menu.Item key="settings">*/}
      {/*    <SettingOutlined/>*/}
      {/*    个人设置*/}
      {/*  </Menu.Item>*/}
      {/*)}*/}
      {/*{menu && <Menu.Divider/>}*/}

      <Menu.Item key="changPassword">
        <KeyOutlined/>
        修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined/>
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar"/>
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
