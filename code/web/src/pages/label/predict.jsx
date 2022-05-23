import React from "react";
import {Breadcrumb, Col, Image, Input, Row, Spin, Upload} from "antd";
import BaseComponent from "@/pages/BaseComponent";
import {Link} from 'umi';
import {getPageTitleByPath} from "@/utils/utils";
import {InboxOutlined} from "@ant-design/icons";
import {getAccessToken} from "@/utils/authority";
import ReactJson from "react-json-view";

export default class index extends BaseComponent {
  state = {
    response: {}
  }

  componentDidMount() {
    //
  }

  render() {
    return <div>
      <Breadcrumb
        style={{
          padding: 20, paddingTop: 0, paddingBottom: 0,
        }}
      >
        <Breadcrumb.Item>
          <Link to="/">{getPageTitleByPath()}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>{getPageTitleByPath('/predict')}</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          background: 'white', padding: 20, margin: "20px 0"
        }}
      >
        <Spin spinning={this.state.loading || false}>
          <Upload.Dragger
            name='file'
            action='/api/auth/predict'
            headers={{
              Authorization: getAccessToken(),
            }}
            data={{
              result_image: 1
            }}
            onChange={info => {
              this.setStateSimple('loading', true)
              if (info.file.status === 'done') {
                this.setStateSimple('loading', false)
                this.setStateSimple('response', info.file.response)
              }
            }}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">支持点击选择文件，或拖动文件到当前区域内</p>
            <p className="ant-upload-hint">
              支持识别jpg,png,jpeg格式的文件，识别结果将出现在下面的方框中
            </p>
          </Upload.Dragger>
        </Spin>
        <Row style={{marginTop: 20}}>
          <Col lg={12}>
            <div style={{padding: 30}}>
              <p style={{textAlign: 'center'}}>结果图</p>
              <div style={{minHeight: 54, background: "gray"}}>
                <Image
                  width="100%"
                  src={this.state.response.info && this.state.response.info.result_image}
                />
              </div>
            </div>
          </Col>
          <Col lg={12}>
            <div style={{padding: 30}}>
              <p style={{textAlign: 'center'}}>返回结果</p>
              {/*<Input.TextArea*/}
              {/*  disabled*/}
              {/*  value={this.state.response.info && JSON.stringify(this.state.response.info)}*/}
              {/*/>*/}
              <ReactJson src={this.state.response}/>
            </div>

          </Col>
        </Row>
      </div>
    </div>
  }

}
