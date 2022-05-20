import { Message, MessageBox, Loading } from 'element-ui'

export default {
  /**
   * 消息提示,悬浮在窗体上方
   * @param {*} msg 提示内容
   * @param {*} type 类型
   */
  message (msg, type = 'success') {
    Message({ message: msg, type: type })
  },
  /**
   * 确认操作提示
   * @param {Object} param0
   * @param {Function} action 确认后执行的函数
   */
  confirm ({msg, type = 'warning'}, action) {
    MessageBox.confirm(
      msg, '提示',
      {
        confrimButtonText: '确定',
        cancelButtonText: '取消',
        type: type
      })
      .then(action)
      .catch(() => {})
  },
  /**
   * 弹出提示框
   * @param {*} msg 提示内容
   * @param {*} hint 提示标题
   */
  alert (msg, hint = '提示') {
    MessageBox.alert(msg, hint)
  },
  /**
   * 弹出加载提示
   * @param {*} text 提示文本
   */
  loading ({text, target} = {text: '加载中...', target: document.body}) {
    return Loading.service({
      target: target,
      lock: true,
      text: text,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
}
