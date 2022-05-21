import React from "react";
import {Button, Form, Input, Modal, Table, message, Divider, Popconfirm} from "antd";
import {request_get, request_post} from "@/utils/request_tool";
import BaseComponent from "@/pages/BaseComponent";
import {getFullPath} from "@/utils/utils";

export default class label extends BaseComponent {
  state = {
    param: {
      page: 1, page_rows: 10,
    }, list: [], total: 0, visible: false, temp_data: {}, loading: false,
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    this.setState({loading: true}, () => {
      request_post('/api/auth/getLabel', this.state.param).then((res) => {
        this.setStateSimple('list', res.info.list)
        this.setStateSimple('total', res.info.total)
        this.setStateSimple('loading', false)
      })
    })
  }

  columns = [{
    title: 'ID', dataIndex: 'id',
  }, {
    title: '名称', dataIndex: 'name',
  }, {
    title: '创建时间', dataIndex: 'created_at',
  }, {
    title: '更新时间', dataIndex: 'updated_at',
  }, {
    title: '操作', render: (record) => {
      return <div>
        <a
          onClick={() => {
            window.location.href = getFullPath('/database/backup/' + record.id)
          }}
        >
          备份配置
        </a>
        <Divider type='vertical'/>
        <a
          onClick={() => {
            this.setStateSimple('temp_data', record, () => {
              this.setStateSimple('visible', true)
            })
          }}
        >
          编辑
        </a>
        <Divider type='vertical'/>
        <Popconfirm
          title='您确定要删除吗？'
          onConfirm={() => {
            request_post('/api/auth/delLabel', {ids: [record.id]}).then(res => {
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
        <Button
          type='primary'
          onClick={() => {
            this.setStateSimple('visible', true)
          }}
        >
          添加
        </Button>

        <Input.Search
          style={{
            width: 500, float: 'right'
          }}
          placeholder='请输入搜索关键字'
          onSearch={value => {
            this.setState({
              param: {
                ...this.state.param, search: value, page: 1,
              }
            }, () => {
              this.fetch()
            })
          }}
        />
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
      <Modal
        title='标签'
        visible={this.state.visible}
        onCancel={() => {
          this.setStateSimple('visible', false)
          this.setStateSimple('temp_data', {})
        }}
        onOk={() => {
          request_post('/api/auth/saveLabel', this.state.temp_data).then(res => {
            if (res.code === 200) {
              message.success(res.message)
              this.setStateSimple('visible', false)
              this.setStateSimple('temp_data', {})
              this.fetch()
            }
          })
        }}
      >
        <Form
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          autoComplete='off'
        >
          <Form.Item label='类别名称' required>
            <Input placeholder='请输入' onChange={(e) => {
              this.setStateSimple('temp_data.name', e.target.value)
            }} value={this.state.temp_data.name || ''}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  }

}
