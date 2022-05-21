import {SettingDrawer} from '@ant-design/pro-layout';
import {PageLoading} from '@ant-design/pro-layout';
import {history, Link} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {request_post} from "@/utils/request_tool";
import {extra_config} from "../config/extra.config";
import {getQueryString} from "@/utils/utils";
import {setAccessToken} from "@/utils/authority";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = extra_config.url401;
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading/>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  let currentUser = {}
  if (window.location.pathname !== loginPath) {
    //CAS登录时，会携带token过来，这里接收token
    const authorization = getQueryString('authorization')
    if (authorization) {
      setAccessToken(authorization)
    }
    const res = await request_post('/api/auth/getUserInfo');
    currentUser = res.info
    currentUser.name = currentUser.name
  }
  return {
    currentUser: currentUser,
    settings: {},
  }
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({initialState, setInitialState}) => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history; // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ?
      // [
      //   <Link to="/umi/plugin/openapi" target="_blank">
      //     <LinkOutlined/>
      //     <span>OpenAPI 文档</span>
      //   </Link>,
      //   <Link to="/~docs">
      //     <BookOutlined/>
      //     <span>业务组件文档</span>
      //   </Link>,
      // ]
      []
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({...preInitialState, settings}));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
