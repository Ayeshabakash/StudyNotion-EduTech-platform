import React from 'react'
import ChangeProfileImage from './ChangeProfileImage'
import EditPersonalInfo from './EditPersonalInfo'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'

const Settings = () => {
  return (
    <div>
       <h2 className='text-3xl font-medium mb-14 text-richblack-5'>Edit Profile</h2>

       <ChangeProfileImage/>

       <EditPersonalInfo/>

       <ChangePassword/>

       <DeleteAccount/>
    </div>
  )
}

export default Settings