import React from 'react'
import Template from '../component/core/Auth/Template'
import image from "../assets/Images/signup.webp";

const SignUp = () => {
  return (
    <Template
        title={"Join the millions learning to code with StudyNotion for free"}
        description1 ={"Build skills for today, tomorrow, and beyond."}
        description2 = {"Education to future-proof your caree"}
        image = {image}
        formType = {"signup"}
    />
  )
}

export default SignUp