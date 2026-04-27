import React, { useState } from "react";
import axios from "axios";

function SignupPage() {

  const [formdata,setformdata]=useState({});
  
  function inputhandler(e){
    const {name,value}=e.target;
  setformdata((prev) =>({...prev,[name]:value}))

  }
  async function submithandler(e){
    e.preventDefault();

    const res=await axios.post("http://localhost:3000/api/v1/user/signup",formdata)
    console.log(res);

    console.log(formdata)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-white">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Create Account
        </h2>

        <form onSubmit={submithandler} className="space-y-4">

          <input type="text" name="name" placeholder="Full Name" onChange={inputhandler} className="w-full px-4 py-2 border rounded-lg" />

          <input type="email" name="email" placeholder="Email Address" onChange={inputhandler} className="w-full px-4 py-2 border rounded-lg" />

          <input type="tel" name="mobile" placeholder="Mobile Number" onChange={inputhandler} className="w-full px-4 py-2 border rounded-lg" />

          <input type="password" name="password" placeholder="Password" onChange={inputhandler} className="w-full px-4 py-2 border rounded-lg" />

          <select name="role" onChange={inputhandler} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg">
            Sign Up
          </button>

        </form>

      </div>
    </div>
  );
}

export default SignupPage;