import React, { useState, useContext } from 'react'
import assets from '../assets/assets'
import {AuthContext} from '../context/AuthContext'

const Login = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const {login} = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (currState === 'Sign up' && !isDataSubmitted) {
        setIsDataSubmitted(true)
        return
      }

      setLoading(true);
      await login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-md'>
      {/* left */}
      <img src={assets.logo} alt="logo" className='w-[min(30vw,250px)]' />

      {/* right */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && 
            <img
            onClick={()=>isDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
          onChange={(e)=>setFullName(e.target.value)} value={fullName}
           type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )}
  
        {!isDataSubmitted && (
          <>
            <input
            onChange={(e)=>setEmail(e.target.value)} value={email}
            type="email" placeholder='Email Address' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required 
            />
            <input
            onChange={(e)=>setPassword(e.target.value)} value={password}
            type="password" placeholder='Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required 
            />
          </>
        )}
  
        {
          currState === "Sign up" && isDataSubmitted && (
            <textarea
            onChange={(e)=>setBio(e.target.value)} value={bio}
            rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Short Bio about yourself...'>
            
            </textarea>
          )
        }
  
        <button 
          type='submit' 
          disabled={loading} 
          className='py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md cursor-pointer flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}'
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            : currState === "Sign up" ? "Create Account" : "Login Now"
          }
        </button>
      
        {
          currState === "Sign up" && (
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <input type="checkbox"/>
              <p>Agree to the terms of use & privacy policy.</p>
            </div>
          )

        }
      
        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>Already have an account? 
              <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-blue-500 cursor-pointer'
                >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account 
              <span onClick={()=>{setCurrState("Sign up")}} className='font-medium text-blue-500 cursor-pointer'
                >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login