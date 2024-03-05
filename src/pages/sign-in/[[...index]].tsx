import { FormEvent, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
 

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // start the sign In process.
  const handleSubmit = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!isLoaded) return;
 
    try {
      const result = await signIn.create({
        identifier: Username,
        password,
      });
 
      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      }
      else {
        /*Investigate why the login hasn't completed */
        console.log(result);
      }
 
    } catch (err: unknown) {
        const knownError = err as { errors: { longMessage: string }[] };
        console.error("error", !knownError?.errors?.[0]?.longMessage, "typof", typeof err);
    }
  };
 
  return (
    <div className="bg-white font-family-karla h-screen">

        <div className="w-full flex flex-wrap">

            {/* <!-- Login Section --> */}
            <div className="w-full md:w-1/2 flex flex-col">

                <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
                    <a href="#" className="bg-black text-white font-bold text-xl p-4">Logo</a>
                </div>

                <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
                    <p className="text-center text-3xl">Log In</p>
                    <form className="flex flex-col pt-3 md:pt-8">
                        <div className="flex flex-col pt-4">
                            <label htmlFor="username" className="text-lg">Username</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" placeholder="John Doe" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
        
                        <div className="flex flex-col pt-4">
                            <label htmlFor="password" className="text-lg">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
        
                        <input onClick={handleSubmit} type="submit" value="Log In" className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8" />
                    </form>
                </div>

            </div>

            {/* <!-- Image Section --> */}
            <div className="w-1/2 shadow-2xl">
                <img className="object-cover w-full h-screen hidden md:block" src="https://source.unsplash.com/IXUM4cJynP0" />
            </div>
        </div>

    </div>
  );
}

    {/* <div>
      <form>
        <div>
          <label htmlFor="email">Username</label>
          <input onChange={(e) => setUsername(e.target.value)} id="email" name="email" type="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" />
        </div>
        <button onClick={handleSubmit}>Sign In</button>
      </form>
    </div> */}