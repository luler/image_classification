import React from "react";
import {Button, Form, Input, Modal, Table, message, Divider, Popconfirm, Upload, Breadcrumb, Image} from "antd";
import {request_get, request_post} from "@/utils/request_tool";
import BaseComponent from "@/pages/BaseComponent";
import {bytesToSize, getPageTitleByPath, getQueryString} from "@/utils/utils";
import {getAccessToken} from "@/utils/authority";
import {Link} from "umi";

export default class label extends BaseComponent {
  state = {
    param: {
      label_id: this.props.match.params.id, page: 1, page_rows: 10,
    }, list: [], total: 0, visible: false, temp_data: {}, loading: false, is_uploading: false,
  }

  componentDidMount() {
    this.fetch()
    let that = this
    setInterval(function () {
      if (that.state.is_uploading) {
        that.setStateSimple('is_uploading', false)
        that.fetch()
      }
    }, 1000)
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
    title: '图片', render: record => <Image width={120} alt='暂无图片' src={'/' + record.path}/>
  }, {
    title: '大小', render: record => bytesToSize(record.size)
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
      <Breadcrumb
        style={{
          padding: 20, paddingTop: 0, paddingBottom: 0,
        }}
      >
        <Breadcrumb.Item>
          <Link to="/">{getPageTitleByPath()}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to='/label/list'>{getPageTitleByPath('/label/list')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>{getPageTitleByPath('/label/list/:id/image')}
            {getQueryString('name') && " [ 类别: " + getQueryString('name') + " ] "}
          </a>
        </Breadcrumb.Item>
      </Breadcrumb>
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
          onChange={info => {
            if (info.file.status === 'done') {
              this.setStateSimple('is_uploading', true)
            }
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
          &nbsp;
          &nbsp;
          <Button
            onClick={(event) => {
              event.stopPropagation()
              if (!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0) {
                message.warning('删除选项不能为空')
                return false
              }
              Modal.confirm({
                title: '删除提示', content: '您确定要删除选中项目吗？', onOk: () => {
                  request_post('/api/auth/delImage', {ids: this.state.selectedRowKeys}).then(res => {
                    if (res.code === 200) {
                      message.success('删除成功')
                      this.fetch()
                    }
                  })
                }
              })
            }}

            // style={{float: "left"}}
            type='danger'
          >
            删除选中
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
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            this.setStateSimple('selectedRowKeys', selectedRowKeys)
          }
        }}
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
