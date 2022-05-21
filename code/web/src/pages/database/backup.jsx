import React from "react";
import {Button, Form, Input, Modal, Table, message, Divider, Popconfirm, Switch, Select, Tag} from "antd";
import {request_get, request_post} from "@/utils/request_tool";
import BaseComponent from "@/pages/BaseComponent";
import {LeftCircleOutlined} from "@ant-design/icons";
import {getFullPath} from "@/utils/utils";

export default class backup extends BaseComponent {
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
    all_tables: [],
    temp_data: {},
    backup_working: [],
  }

  componentDidMount() {
    this.setStateSimple('param.id', this.props.match.params.id)
    this.fetch()

    request_get('/api/home/getDatabaseTables', {database_id: this.state.param.id}).then(res => {
      this.setStateSimple('all_tables', res.info)
    })

    this.getBackupWorking(this)
    const that = this
    setInterval(() => {
      that.getBackupWorking(that)
    }, 3000)
  }

  getBackupWorking = (that) => {
    request_get('/api/home/getBackupWorking').then(res => {
      if (res.code === 200) {
        if (this.state.backup_working.length > 0 && this.state.backup_working.length !== res.info.length) {
          this.fetch()
        }
        that.setStateSimple('backup_working', res.info,);
      }
    })
  }

  fetch() {
    this.setState({loading: true}, () => {
      request_get('/api/home/getBackupList', this.state.param).then((res) => {
        this.setStateSimple('list', res.info.list)
        this.setStateSimple('total', res.info.total)
        this.setStateSimple('loading', false)
      })
    })
  }

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '数据库名称',
      dataIndex: 'title',
    },
    {
      title: '指定表',
      width: 300,
      render: record => {
        return <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{record.tables}</div>
      }
    },
    {
      title: '定时配置',
      dataIndex: 'cron',
    },
    {
      title: '状态',
      render: record => {
        return <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={record.status !== '0'}
          onChange={checked => {
            request_post('/api/home/saveBackupStatus', {
              id: record.id,
              status: checked ? 1 : 0
            }).then(res => {
              this.fetch()
            })
          }}
        />
      }
    },
    {
      title: '保留数量',
      render: record => {
        return record.use_count + '/' + record.keep_count
      }
    },
    {
      title: '空间',
      render: record => {
        return <div>
          <Tag>
            已用:{record.size}
          </Tag>
          <div style={{marginTop: 5}}></div>
          <Tag>
            可用:{record.available_size}
          </Tag>

        </div>
      }
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
          <Button
            size='small'
            type='link'
            loading={this.state.backup_working.indexOf(record.id) !== -1}
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: '您正在进行立即备份操作，该操作可能比较耗时，您确定要立即备份吗？',
                onOk: () => {
                  request_post('/api/home/startBackup', {id: record.id}).then(res => {
                    if (res.code === 200) {
                      message.success(res.message)
                      this.getBackupWorking(this)
                    }
                  })
                }
              })

            }}
          >
            立即备份
          </Button>
          <Divider type='vertical'/>
          <a
            onClick={() => {
              window.location.href = getFullPath('/database/backup_file/' + record.id)
            }}
          >
            查看数据
          </a>
          <Divider type='vertical'/>
          <a
            onClick={() => {
              this.setStateSimple('temp_data', JSON.parse(JSON.stringify(record)), () => {
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
              request_post('/api/home/delBackup', {id: record.id}).then(res => {
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
          margin: "20px 0"
        }}
      >
        <Button
          type='primary'
          onClick={() => {
            this.setStateSimple('visible', true)
          }}
        >
          添加备份
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
        onChange={(pagination) => {
          this.setState({
            param: {
              ...this.state.param,
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
      <Modal
        title='备份配置'
        visible={this.state.visible}
        onCancel={() => {
          this.setStateSimple('visible', false)
          this.setStateSimple('temp_data', {})
        }}
        onOk={() => {
          request_post('/api/home/saveBackup', {
            ...this.state.temp_data,
            database_id: this.state.param.id,
            tables: this.state.temp_data.tables_arr?.join(','),
          }).then(res => {
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
          <Form.Item label='定时配置' required extra='遵循crontab语法，如:* * * * *,代表每分钟运行'>
            <Input placeholder='请输入' onChange={(e) => {
              this.setStateSimple('temp_data.cron', e.target.value)
            }} value={this.state.temp_data.cron || ''}/>
          </Form.Item>
          <Form.Item label='保留数量' required extra='控制当前备份数量，若大于该值则删除最旧的备份数据'>
            <Input type='number' placeholder='请输入' onChange={(e) => {
              this.setStateSimple('temp_data.keep_count', e.target.value)
            }} value={this.state.temp_data.keep_count || ''}/>
          </Form.Item>
          {/*<Form.Item label='指定表' extra='指定需要备份的数据表，多个用英文逗号隔开'>*/}
          {/*  <Input placeholder='请输入' onChange={(e) => {*/}
          {/*    this.setStateSimple('temp_data.tables', e.target.value)*/}
          {/*  }} value={this.state.temp_data.tables || ''}/>*/}
          {/*</Form.Item>*/}
          <Form.Item label='指定表' extra='指定需要备份的数据表，多个用英文逗号隔开'>
            <Select
              showSearch
              mode='multiple'
              placeholder='请选择'
              value={this.state.temp_data.tables_arr || []}
              onChange={(value, option) => {
                this.setStateSimple('temp_data.tables_arr', value)
              }}
            >
              {this.state.all_tables.map(value => {
                return <Select.Option key={value} value={value}>{value}</Select.Option>
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  }

}
