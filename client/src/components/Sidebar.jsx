import React, { useContext } from 'react'
import assets, { userDummyData } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Sidebar = ({selectedUser, setSelectUser}) => {

  const {logout} = useContext(AuthContext)

  const navigate = useNavigate()
  return (
    <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-auto text-white ${selectedUser ? "hidden md:block" : ""}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#213542] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={()=>navigate('/profile')} className='text-sm cursor-pointer'>Edit Profile</p>
              <hr className='my-2 border-t text-sm' />
              <p onClick={()=>logout()} className='text-sm cursor-pointer'>Logout</p>
            </div>
          </div>
        </div>

        <div className='bg-blue-500/20 rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="search" className='w-3' />
          <input type="text"className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User' />
        </div>

        <div className='flex flex-col gap-2 mt-2'>
          {userDummyData.map((user, index) => (
            <div onClick={()=>{setSelectUser(user)}} key={index} className={`relative flex items-center gap-2 py-1 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-blue-500/20'}`}>
              <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
              <div className='flex flex-col leading-5'>
                <p>{user.fullName}</p>
                {
                  index < 3
                  ? <span className='text-green-400 text-xs'>Online</span>
                  : <span className='text-neutral-400 text-xs'>Offline</span>
                }
              </div>
              {index > 2 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-blue-500/50'>{index}</p>}
            </div>
          )) }
        </div>
      </div>
    </div>
  )
}

export default Sidebar