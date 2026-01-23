import React, {useState, useContext, useEffect} from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import {ChatContext} from '../context/ChatContext'
import {AuthContext} from '../context/AuthContext'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)

  const [msgImages, setMsgImages] = useState([])

  // Get all the images from the messages and set them to state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=>msg.image)
    )
  }, [messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll 
    ${selectedUser ? 'max-md:hidden' : ''}`}>
      
      <div className='pt-5 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers?.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      <hr className='border-gray-600 my-4'/>

      <div className='px-2 text-xs'>
        <p className="font-semibold">Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 grid grid-cols-2 gap-2 opacity-80'
        >
          {
            msgImages && msgImages.length > 0 ? (
                msgImages.map((url, index)=> (
                <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded overflow-hidden'>
                  <img src={url} alt="" className='w-full h-full object-cover rounded-md' />
                </div>
              ))
            ) : (<p className="col-span-2 text-gray-400 text-center">No media yet</p>)
          }
        </div>
      </div>

      <button onClick={()=> logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer '>
        Logout
      </button>
    </div>
  )
}

export default RightSidebar