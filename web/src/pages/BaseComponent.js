import {Component} from "react";

export default class BaseComponent extends Component {
  // 配置state某个值，json字段路径用.隔开
  setStateSimple(key, value, callback) {
    const keyArr = key.split('.');
    const state = {}
    let stateEval = 'state'
    // eslint-disable-next-line array-callback-return
    keyArr.map((v, i) => {
      stateEval = `${stateEval}['${v}']`;
      if (i === 0) {
        state[v] = this.state[v] || {}
      } else {
        // eslint-disable-next-line no-eval
        eval(`${stateEval} = ${stateEval} || {}`)
      }
    })
    stateEval = `${stateEval}=value`;
    // eslint-disable-next-line no-eval
    eval(stateEval)
    super.setState(state, callback);
  }
}
