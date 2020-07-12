import {
  FETCH_AUTH_START,
  FETCH_AUTH_SUCCESS,
  FETCH_AUTH_FAILURE,
  CLEAR_ERROR,
} from "./userTypes"

export const fetchStart = () => {
  return {
    type: FETCH_AUTH_START,
  }
}
export const fetchSuccess = (auth) => {
  return {
    type: FETCH_AUTH_SUCCESS,
    payload: auth,
  }
}
export const fetchFailure = (error) => {
  return {
    type: FETCH_AUTH_FAILURE,
    payload: error,
  }
}
export const clearError = (param) => {
  return {
    type: CLEAR_ERROR,
    payload: param,
  }
}
