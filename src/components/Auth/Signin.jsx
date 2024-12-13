import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Pages/Footer";
import { FaSortDown } from "react-icons/fa";
import { IoLanguageSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { loginUser } from "../Redux/features/auth/authSlice";
import miniimg from "../../assets/img/mini-img.png";
import PRoutes from "./PRoutes";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Dispatch Redux action and wait for it to complete
      await dispatch(loginUser({ email, password }));

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${user.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      setEmail("");
      setPassword("");

      // Redirect after successful login
      navigate("/Homepage");
    } catch (error) {
      // Error Alert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    }
  };

  return (
    <div>
      <div className="bgmain signbg-main bg-cover bg-center h-screen flex flex-col justify-between px-[9.25rem]">

        <div className="relative z-10 flex justify-between items-center h-[5.5rem]">
          <div className="web-logo-home logo w-[9.64vw]">
            <span className="" data-uia="nmhp-card-header+logo">
              <svg
                viewBox="0 0 111 30"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                className=""
              >
                <g>
                  <path
                    d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"
                    fill="#E50914"
                  ></path>
                </g>
              </svg>

              <span className="default-ltr-cache-raue2m ev1dnif1"></span>
            </span>
          </div>

          <div className="mobile-logo-home hidden">
            <img src={miniimg} alt="logo" srcset="" />
          </div>

          <div className="flex gap-[15px] font-NetflixSans_Bd text-white">
            <div className="option-home relative w-[7.8vw] rounded-[4px] border-[1px] border-[#545454] flex items-center font-NetflixSans_Md">
              <div>
                <IoLanguageSharp className="text-white" />
              </div>
              <select className=" text-white appearance-none bg-transparent focus:outline-none pl-2 pr-6">
                <option className="font-NetflixSans_Md">English</option>
                <option>हिन्दी</option>
              </select>
              <div className="relative top-[-5px] right-[10px]">
                <FaSortDown className=" text-white  pointer-events-none" />
              </div>
            </div>
            <div>
              <button className="py-[4px] px-[16px] rounded-[4px] bg-NetRed">
                <Link to="/signin">Sign In</Link>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-grow px-4 sm:px-8 md:px-16">
          <div className="loginform bg-black bg-opacity-70 p-6 sm:p-8 md:p-10 rounded-lg max-w-md w-full">
            {/* Sign Up Form */}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="email"
                  className="loginform-input w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="loginform-input w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  minLength={8}
                  maxLength={8}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition duration-300"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              {/* Additional Options */}
              <div className="flex justify-between items-center text-gray-400 text-sm mt-4">
                <div>
                  <input type="checkbox" id="remember-me" className="mr-1" />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
                <Link to="/" className="hover:underline">
                  Need help?
                </Link>
              </div>

              {/* Sign Up and Other Links */}
              <div className="text-center text-gray-400 text-sm mt-8">
                <p>
                  if you have no account so create account ?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold underline hover:underline"
                  >
                    Sign up now
                  </Link>
                </p>

                <p className="mt-2 text-xs">
                  This page is protected by Google reCAPTCHA to ensure you're
                  not a bot.{" "}
                  <Link to="/" className="text-blue-500 hover:underline">
                    Learn more.
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;
