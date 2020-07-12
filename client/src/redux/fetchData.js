import axios from "axios"

export const fetchData = (
  { method, url, data, token },
  { fetchStart, fetchSuccess, fetchFailure },
  options
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchStart())
      const res = await axios({
        url,
        method,
        data,
        headers: token && {
          Authorization: `Basic ${token}`,
        },
      })
      dispatch(fetchSuccess({ data: res.data, options }))
    } catch (error) {
      dispatch(fetchFailure(error.response.data.errors))
    }
  }
}
