import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { fetchData } from "../redux/fetchData"

function useHTTP() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.accessToken)

  const getData = async (
    { isAuthServer, stateDepOnRes },
    { method, url, data = null },
    { fetchStart, fetchSuccess, fetchFailure }
  ) => {
    const isDevelopment = true

    const host = isDevelopment
      ? `http://localhost:${isAuthServer ? "4000" : "5000"}`
      : ""

    if (stateDepOnRes) {
      dispatch(
        fetchData(
          {
            method,
            url: `${host}${url}`,
            data,
            token,
          },
          { fetchStart, fetchSuccess, fetchFailure }
        )
      )
    } else {
      await axios({
        url: `${host}${url}`,
        method,
        data,
        headers: token && {
          Authorization: `Basic ${token}`,
        },
      })
    }
  }

  return { getData }
}

export default useHTTP
