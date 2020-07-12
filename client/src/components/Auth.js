import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  clearError,
} from "../redux/user/userActions"
import { AiOutlineLogin, AiOutlineCheckCircle } from "react-icons/ai"
import useHTTP from "../hooks/useHTTP"
import { MdErrorOutline } from "react-icons/md"

function Auth() {
  const [form, setForm] = useState([
    { param: "username", value: "", msg: "", type: "text" },
    { param: "email", value: "", msg: "", type: "email" },
    { param: "password", value: "", msg: "", type: "password" },
  ])
  const [isLogin, setIsLogin] = useState(true)
  const { getData } = useHTTP()
  const { auth, load, error } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    setForm((prevForm) =>
      prevForm.map((item) => {
        error.map((err) => {
          if (err.param === item.param) {
            item.msg = err.msg
          }
          return err
        })
        return item
      })
    )
  }, [error])

  useEffect(() => {
    if (auth.accessToken) {
      localStorage.setItem("auth", JSON.stringify(auth))
    }
  }, [auth])

  const handleChange = (e) => {
    setForm(
      form.map((item) => {
        if (item.param === e.target.name) {
          item.value = e.target.value
          item.msg = ""
          dispatch(clearError(e.target.name))
        }
        return item
      })
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let isEmpty = false
    setForm(
      form.map((item) => {
        if (
          (item.param !== "username" && isLogin && !item.value) ||
          (!isLogin && !item.value)
        ) {
          item.msg = "Fill this field!"
          isEmpty = true
        }
        return item
      })
    )

    if (isEmpty) {
      return
    }

    const [username, email, password] = form

    if (isLogin) {
      await getData(
        { isAuthServer: true, stateDepOnRes: true },
        {
          method: "post",
          url: "/auth/login",
          data: { email: email.value, password: password.value },
        },
        { fetchStart, fetchSuccess, fetchFailure }
      )
    } else {
      await getData(
        { isAuthServer: true, stateDepOnRes: true },
        {
          method: "post",
          url: "/auth/register",
          data: {
            username: username.value,
            email: email.value,
            password: password.value,
          },
        },
        { fetchStart, fetchSuccess, fetchFailure }
      )
    }
  }

  const handleFlip = () => {
    setIsLogin(!isLogin)
    dispatch(clearError())
    setForm(
      form.map((item) => {
        item.msg = ""
        return item
      })
    )
  }

  const inputs = form.map((item) => {
    return (
      <label
        key={item.param}
        className={`form__container ${
          isLogin && item.param === "username" && "form__container--close"
        }`}
      >
        <div className='form__label'>
          <span>{item.param}:</span>
          <span
            className={`form__warning ${item.msg && "form__warning--open"}`}
          >
            <MdErrorOutline />
            <span className='form__message'>
              {item.msg}
              <span className='form__triangle'></span>
            </span>
          </span>
        </div>
        <input
          type={item.type}
          name={item.param}
          value={item.value}
          className={`form__input ${item.msg && "form__input--warning"}`}
          onChange={handleChange}
          autoComplete='off'
        />
      </label>
    )
  })

  return (
    <div className='form'>
      <div className={`form__loader ${load && "form__loader--load"}`}>
        <div className='form__spiner1'></div>
        <div className='form__spiner2'></div>
      </div>
      <div className='form__title'>
        <h2>{isLogin ? "Login" : "Register"}</h2>
      </div>
      {inputs}
      <div className='form__bts-container'>
        <button className='button-primary' onClick={handleSubmit}>
          <span className='button-primary__button-name'>
            {isLogin ? "Sign In" : "Sign Up"}
          </span>
          {isLogin ? <AiOutlineLogin /> : <AiOutlineCheckCircle />}
        </button>
        <button className='button-simple' onClick={handleFlip}>
          <span className='button-simple__button-name'>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
          {isLogin ? <AiOutlineCheckCircle /> : <AiOutlineLogin />}
        </button>
      </div>
    </div>
  )
}

export default Auth
