import React from "react";
import {Button, Form, Input, Modal, Table, message, Divider, Popconfirm, Upload} from "antd";
import {request_get, request_post} from "@/utils/request_tool";
import BaseComponent from "@/pages/BaseComponent";
import {getFullPath} from "@/utils/utils";
import {getAccessToken} from "@/utils/authority";

export default class label extends BaseComponent {
  state = {
    param: {
      label_id: this.props.match.params.id, page: 1, page_rows: 10,
    }, list: [], total: 0, visible: false, temp_data: {}, loading: false,
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    this.setState({loading: true}, () => {
      request_post('/api/auth/getImage', this.state.param).then((res) => {
        this.setStateSimple('list', res.info.list)
        this.setStateSimple('total', res.info.total)
        this.setStateSimple('loading', false)
      })
    })
  }

  columns = [{
    title: 'ID', dataIndex: 'id',
  }, {
    title: '图片', render: record => <img height={120} alt='暂无图片' src={'/' + record.path}/>
  }, {
    title: '创建时间', dataIndex: 'created_at',
  }, {
    title: '更新时间', dataIndex: 'updated_at',
  }, {
    title: '操作', render: (record) => {
      return <div>
        <Popconfirm
          title='您确定要删除吗？'
          onConfirm={() => {
            request_post('/api/auth/delImage', {ids: [record.id]}).then(res => {
              if (res.code === 200) {
                message.success('删除成功')
                this.fetch()
              }
            })
          }}
        >
          <a
            style={{color: 'red'}}
          >
            删除
          </a>
        </Popconfirm>
      </div>
    }
  },]

  render() {
    return <div>
      <div
        style={{
          background: 'white', padding: 20, margin: "20px 0"
        }}
      >
        <Upload
          name='files'
          multiple
          action='/api/auth/uploadImage'
          headers={{
            Authorization: getAccessToken()
          }}
          data={{
            label_id: this.state.param.label_id
          }}
        >
          <Button
            type='primary'
          >
            上传
          </Button>
        </Upload>

        {/*<Input.Search*/}
        {/*  style={{*/}
        {/*    width: 500, float: 'right'*/}
        {/*  }}*/}
        {/*  placeholder='请输入搜索关键字'*/}
        {/*  onSearch={value => {*/}
        {/*    this.setState({*/}
        {/*      param: {*/}
        {/*        ...this.state.param, search: value, page: 1,*/}
        {/*      }*/}
        {/*    }, () => {*/}
        {/*      this.fetch()*/}
        {/*    })*/}
        {/*  }}*/}
        {/*/>*/}
      </div>
      <Table
        onChange={(pagination) => {
          this.setState({
            param: {
              ...this.state.param, page: pagination.current, page_rows: pagination.pageSize,
            }
          }, () => {
            this.fetch()
          })
        }}
        pagination={{
          showSizeChanger: true,
          current: this.state.param.page,
          total: this.state.total,
          pageSize: this.state.param.page_rows,
          showTotal: (total) => {
            return <div>总共 {total} 条数据</div>
          }
        }}
        loading={this.state.loading}
        rowKey='id'
        dataSource={this.state.list}
        columns={this.columns}
      />
    </div>
  }

}
