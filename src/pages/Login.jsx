import React from 'react'
import Template from '../component/core/Auth/Template'
import image from "../assets/Images/login.webp"

const Login = () => {
  return (
    <Template
        title={"Welcome Back"}
        description1 ={"Build skills for today, tomorrow, and beyond."}
        description2 = {"Education to future-proof your caree"}
        image = {image}
        formType = {"login"}
    />
  )
}

export default Login