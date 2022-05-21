import React from "react";
import {Input, Table, message, Popconfirm, Button, Modal} from "antd";
import {request_get, request_post} from "@/utils/request_tool";
import BaseComponent from "@/pages/BaseComponent";
import {LeftCircleOutlined} from "@ant-design/icons";
import {getAccessToken} from "@/utils/authority";

export default class backup_file extends BaseComponent {
  state = {
    param: {
      id: 0,
      page: 1,
      page_rows: 10,
    },
    list: [],
    total: 0,
    visible: false,
    loading: false,
    temp_data: {},
    selectedRowKeys: [],
  }

  componentDidMount() {
    this.setStateSimple('param.id', this.props.match.params.id)
    this.fetch()
  }

  fetch() {
    this.setState({loading: true}, () => {
      request_get('/api/home/getBackupFileList', this.state.param).then((res) => {
        this.setStateSimple('list', res.info.list)
        this.setStateSimple('total', res.info.total)
        this.setStateSimple('loading', false)
      })
    })
  }

  downloadFileByIds = (ids) => {
    window.open('/api/home/downloadFile?id=' + ids.join(',') + '&authorization=' + getAccessToken())
  }
  downloadFileByNum = (num) => {
    window.open('/api/home/downloadFile?num=' + num + '&backup_id=' + this.state.param.id + '&authorization=' + getAccessToken())
  }

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '备份序号',
      render: record => {
        return <a
          title='点击下载'
          onClick={() => {
            this.downloadFileByNum(record.num)
          }}
        >
          {record.num}
        </a>
      }
    },
    {
      title: '文件名',
      render: record => {
        return <a
          title='点击下载'
          onClick={() => {
            this.downloadFileByIds([record.id])
          }}
        >
          {record.file_name}
        </a>
      }
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
    },
    {
      title: '操作',
      render: (record) => {
        return <div>
          <Popconfirm
            title='您确定要删除吗？'
            onConfirm={() => {
              request_post('/api/home/delBackupFile', {ids: [record.id]}).then(res => {
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
    },
  ]

  render() {
    return <div>
      <div>
        <a onClick={() => {
          window.history.back()
        }}><LeftCircleOutlined/>&nbsp;返回</a>
      </div>
      <div
        style={{
          background: 'white',
          padding: 20,
          margin: "20px 0",
          height: 70,
        }}
      >
        <Button
          type='danger'
          onClick={() => {
            if (this.state.selectedRowKeys.length === 0) {
              message.warn('勾选项目不能为空')
              return
            }
            Modal.confirm({
              title: '注意',
              content: '内容删除不可恢复，您确定要删除吗？',
              onOk: () => {
                request_post('/api/home/delBackupFile', {ids: this.state.selectedRowKeys}).then(res => {
                  if (res.code === 200) {
                    message.success('删除成功')
                    this.fetch()
                  }
                })
              }
            })
          }}
        >
          删除选中
        </Button>
        <Button
          style={{marginLeft: 10}}
          onClick={() => {
            if (this.state.selectedRowKeys.length === 0) {
              message.warn('勾选项目不能为空')
              return
            }
            this.downloadFileByIds(this.state.selectedRowKeys)
          }}
        >
          下载选中
        </Button>

        <Input.Search
          style={{
            width: 500,
            float: 'right'
          }}
          placeholder='请输入搜索关键字'
          onSearch={value => {
            this.setState({
              param: {
                ...this.state.param,
                search: value,
                page: 1,
              }
            }, () => {
              this.fetch()
            })
          }}
        />
      </div>
      <Table
        rowSelection={{
          selectedRowKeys: this.state.selectedRowKeys,
          onChange: (selectedRowKeys) => {
            this.setStateSimple('selectedRowKeys', selectedRowKeys)
          },
        }}
        onChange={(pagination, filters, sorter) => {
          this.setState({
            param: {
              ...this.state.param,
              sort_type: sorter.field + '.' + sorter.order,
              page: pagination.current,
              page_rows: pagination.pageSize,
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
