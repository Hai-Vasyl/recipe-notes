import {
  FETCH_AUTH_START,
  FETCH_AUTH_SUCCESS,
  FETCH_AUTH_FAILURE,
  CLEAR_ERROR,
} from "./userTypes"

const initialState = {
  error: [],
  auth: {},
  load: false,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTH_START:
      return {
        ...state,
        load: true,
      }
    case FETCH_AUTH_SUCCESS:
      return {
        error: [],
        auth: action.payload.data,
        load: false,
      }
    case FETCH_AUTH_FAILURE:
      return {
        ...state,
        error: action.payload,
        load: false,
      }
    case CLEAR_ERROR:
      if (!action.payload) {
        return {
          ...state,
          error: [],
        }
      }
      return {
        ...state,
        error: state.error.map((err) => {
          if (err.param === action.payload) {
            err.msg = ""
          }
          return err
        }),
      }
    default:
      return state
  }
}

export default userReducer
