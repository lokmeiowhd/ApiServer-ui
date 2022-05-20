import Axios from 'axios'
import GlobleVars from '../api/globlevars'
import Msg from '../api/messagebox'

const axios = Axios.create({
  baseURL: window.gcfg.baseUrl
})

// axios.defaults.baseURL = window.gcfg.baseUrl
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Cache-Control'] = 'no-cache'

axios.interceptors.request.use(
  config => {
    if (GlobleVars.token) {
      config.headers.Authorization = `bearer ${GlobleVars.token}`
    }
    return config
  },
  err => Promise.reject(err)
)

export default {
  post (url, params, successAction, errorAction, loading) {
    axios.post(url, params)
      .then(rst => {
        if (rst.data.code === 200) {
          successAction ? successAction(rst.data.data || rst.data) : Msg.message('success.')
        } else {
          errorAction ? errorAction(rst.data.error) : Msg.message(rst.data.error, 'error')
          console.error(rst.data.error)
        }
        if (loading) loading.close()
      })
      .catch(err => {
        if (loading) loading.close()
        console.error(err)
        Msg.message('网络错误', 'error')
      })
  },
  get (url, params, successAction, errorAction, loading, responseType = 'json') {
    axios.get(url, {params: params, responseType: responseType})
      .then(rst => {
        if (rst.status === 200 || rst.data.code === 200) {
          successAction ? successAction(rst.data.data || rst.data) : Msg.message('success.')
        } else {
          errorAction ? errorAction(rst.data.error) : Msg.message(rst.data.error, 'error')
          console.error(rst.data.error)
        }
        if (loading) loading.close()
      })
      .catch(err => {
        if (loading) loading.close()
        console.error(err)
        Msg.message('网络错误', 'error')
      })
  }
}
