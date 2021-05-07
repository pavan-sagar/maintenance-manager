import React from "react";

export default function login() {
  return (
    <div className="relative inline-block md:w-1/4  px-2  mt-[3rem]">
      <form method="post" action="http://localhost:3001/login" className="flex flex-col">
        <div className="flex justify-between">
        <label for="email" className="">Email address</label>
        <input className="border-2" name="email" type="email" required/>
        </div>
        <br />
        <div className="flex justify-between">

        <label for="password" className="t">Password</label>
        <input
          className="border-2"
          type="password" name="password" required
          />
          </div>
        <br/>
        <button type="submit" className="bg-blue-300 w-2/4 md mt-[1rem] self-end hover:bg-blue-400 px-8 py-2 rounded-md focus:outline-none focus:ring focus-border-blue-500">Submit</button>
        
      </form>
    </div>
  );
}
