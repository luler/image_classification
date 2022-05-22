import React from "react";
import {Button, Form, Input, Modal, Table, message, Divider, Popconfirm, Breadcrumb} from "antd";
import {request_post} from "@/utils/request_tool";
import BaseComponent from "@/pages/BaseComponent";
import {history, Link} from 'umi';
import {getPageTitleByPath} from "@/utils/utils";

export default class label extends BaseComponent {
  state = {
    param: {
      page: 1, page_rows: 10,
    }, list: [], total: 0, visible: false, temp_data: {}, loading: false, rebuild_index_loading: false,
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
            // window.location.href = getFullPath('/label/list/' + record.id + '/image')
            history.push('/label/list/' + record.id + '/image?name=' + record.name)
          }}
        >
          图片管理
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
      <Breadcrumb
        style={{
          padding: 20,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Breadcrumb.Item>
          <Link to="/">{getPageTitleByPath()}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>{getPageTitleByPath('/label/list')}</a>
        </Breadcrumb.Item>
      </Breadcrumb>
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
        &nbsp;
        &nbsp;
        <Button
          type='dashed'
          loading={this.state.rebuild_index_loading}
          onClick={() => {
            Modal.confirm({
              icon: false, title: '重建索引提示', content: '您是否确定基于当前数据重新创建索引文件？', onOk: () => {
                this.setStateSimple('rebuild_index_loading', true)
                request_post('/api/auth/rebuildIndex').then(res => {
                  if (res.code === 200) {
                    this.setStateSimple('rebuild_index_loading', false)
                  }
                })
              }
            })
          }}
        >
          重建索引
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
