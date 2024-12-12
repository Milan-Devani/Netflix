import React, { useRef, useState } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import navicon from "../assets/img/SmallAvatar.png";
import { CiSearch } from "react-icons/ci";
import minilogo from "../assets/img/mini-img.png";
import { getsearchMoviesandTvshow } from "./Redux/features/Search/searchSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const Favoriteitem = useSelector((state) => state.Favoriteitem.items);

  const searchtext = useRef();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(result)) {
      navigate("/signin");
    } else {
      console.error("Logout failed:", result.payload);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const toggleSearchBar = () => {
  //   setIsSearchOpen(!isSearchOpen);
  // };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  

  const handleSearchButtonClick = () => {
    // setIsSearchOpen(!isSearchOpen);

    const query = searchtext.current.value.trim();
    if (query.length > 0) {
      dispatch(getsearchMoviesandTvshow({ query }));
      navigate(`/Searchpage?query=${query}`);
    }
  };

  const handleInputChange = () => {
    const query = searchtext.current.value.trim();
    console.log("searchtext:", query);

    if (query.length > 0) {
      handleSearch(query);
    }
  };

  return (
    <nav className="navbar items-center bg-transparent px-16">
      <div className="navbar-logo">
        <Link to="/Homepage">
          <div className="website-views logo w-[36vh] mr-[20px]">
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

          <div className="mobile-views hidden">
            <img src={minilogo} alt="" />
          </div>
        </Link>
      </div>
      <div className="flex gap-[15px] items-center">
        <div className="mobile-view-search-input hidden">
          <input
            type="text"
            ref={searchtext}
            onChange={handleInputChange}
            placeholder="Search"
            className="w-full border border-white p-2 bg-transparent text-white rounded-md"
          />

          <button onClick={handleSearchButtonClick}>
          <li
            className="cursor-pointer list-none"
          >
            <CiSearch className="text-white w-[25px] h-[25px]" />
          </li>
          </button>
        </div>
        <div className="toggle-bar" onClick={toggleMenu}>
          &#9776; {/* Hamburger Icon */}
        </div>
      </div>
      <ul className={`navbar-links items-center ${isMenuOpen ? "open" : ""}`}>
        <div className="navbar-links-sub ">
          <div className="navbar-links-subb flex items-center gap-[25px] ">
            <Link to="/Homepage">
              <div className="navbar-links-sub-logo logo w-[22vh] mr-[50px] hidden">
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
            </Link>

            <Link to="/Homepage">
              <li className="list-none list-li">Home</li>
            </Link>
            <Link to="/Moviespage">
              <li className="list-none list-li">Movies</li>
            </Link>
            <Link to="/Tvshowpage">
              <li className="list-none list-li">TV Shows</li>
            </Link>
            <Link to="/New&Popularpage">
              <li className="list-none list-li">New & Popular</li>
            </Link>
            <Link to="/NetflixWishlistpage">
              <li className="list-none list-li">My Wishlist</li>
            </Link>

            <Link to="/NetflixWishlistpage">
              <li className="list-none list-li">My Wishlist</li>
            </Link>
          </div>

          <div className="mobile-view-item hidden">
            <Link
              className="relative hover:text-green-800"
              to="/NetflixWishFavoritepage"
            >
              <li className="icon">
                <MdOutlineFavorite className="text-white w-[23px] h-[23px]" />
              </li>
              {Favoriteitem.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                  {Favoriteitem.length}
                </span>
              )}
            </Link>
            <div>
              <div className="relative z-[45]">
                <div
                  onClick={toggleDropdown}
                  className="cursor-pointer w-[35px]"
                >
                  <li>
                    <img src={navicon} alt="User Avatar" className="w-8 h-8 " />
                  </li>
                </div>
                <div
                  className={`absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out transform ${
                    isOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <p className="text-gray-700 font-semibold">
                    Username: {user?.username || "Guest"}
                  </p>
                  <p className="text-gray-600">
                    Email: {user?.email || "Not available"}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-itemss flex items-center list-none gap-[15px]">
          <div className="flex items-center gap-[10px]">
            <input
              type="text"
              ref={searchtext}
              onChange={handleInputChange}
              placeholder="Search"
              className="w-full border border-white p-2 bg-transparent text-white rounded-md"
            />

            <li
              onClick={handleSearchButtonClick}
              className="cursor-pointer list-none"
            >
              <CiSearch className="text-white w-[25px] h-[25px]" />
            </li>
          </div>

          <Link
            className="relative hover:text-green-800"
            to="/NetflixWishFavoritepage"
          >
            <li className="icon">
              <MdOutlineFavorite className="text-white w-[23px] h-[23px]" />
            </li>
            {Favoriteitem.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                {Favoriteitem.length}
              </span>
            )}
          </Link>
          <div>
            <div className="relative z-[45]">
              <div onClick={toggleDropdown} className="cursor-pointer w-[35px]">
                <li>
                  <img src={navicon} alt="User Avatar" className="w-8 h-8 " />
                </li>
              </div>
              <div
                className={`absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out transform ${
                  isOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <p className="text-gray-700 font-semibold">
                  Username: {user?.username || "Guest"}
                </p>
                <p className="text-gray-600">
                  Email: {user?.email || "Not available"}
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;




// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=



// import React, { useRef, useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import { FaBars, FaRegBell } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import navicon from "../assets/img/SmallAvatar.png";
// import { useDispatch, useSelector } from "react-redux";
// import { getsearchMoviesandTvshow } from "./Redux/features/Search/searchSlice";
// import { logoutUser } from "./Redux/features/auth/authSlice";
// import { MdOutlineFavorite } from "react-icons/md";

// function Navbar() {
//   const dispatch = useDispatch();
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { user } = useSelector((state) => state.auth);
//   const Favoriteitem = useSelector((state) => state.Favoriteitem.items);

//   const searchtext = useRef();
//   const navigate = useNavigate();

// const handleSearchButtonClick = () => {
//   const query = searchtext.current.value.trim();
//   if (query.length > 0) {
//     dispatch(getsearchMoviesandTvshow({ query }));
//     navigate(`/Searchitem?query=${query}`);
//   }
// };

// const handleInputChange = () => {
//   const query = searchtext.current.value.trim();
//   console.log("searchtext:", query);

//   if (query.length > 0) {
//     handleSearch(query);
//   }
// };

// const toggleDropdown = () => {
//   setIsOpen(!isOpen);
// };

//   const toggleSearchBar = () => {
//     setIsSearchOpen(!isSearchOpen);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

// const handleLogout = async () => {
//   const result = await dispatch(logoutUser());
//   if (logoutUser.fulfilled.match(result)) {
//     navigate("/signin");
//   } else {
//     console.error("Logout failed:", result.payload);
//   }
// };

//   return (
//     <div className="navbar-main px-16 py-[21px] pt-[16px] relative z-[10] bg-transparent">
//       <div>
//         <div className="flex items-center">
//           <Link to="/Homepage">
//             <div className="logo w-[22vh] mr-[50px]">
//               <span className="" data-uia="nmhp-card-header+logo">
//                 <svg
//                   viewBox="0 0 111 30"
//                   version="1.1"
//                   xmlns="http://www.w3.org/2000/svg"
//                   xmlnsXlink="http://www.w3.org/1999/xlink"
//                   aria-hidden="true"
//                   role="img"
//                   className=""
//                 >
//                   <g>
//                     <path
//                       d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"
//                       fill="#E50914"
//                     ></path>
//                   </g>
//                 </svg>

//                 <span className="default-ltr-cache-raue2m ev1dnif1"></span>
//               </span>
//             </div>
//           </Link>
//           <div className="nav-sub flex justify-between w-full items-center relative ">
//             <nav className="nav-web-view gap-[20px] flex font-NetflixSans items-center">
//               {/* Desktop Navigation */}
//               <Link to="/Homepage" className="text-white">
//                 <li className="list-none">Home</li>
//               </Link>
//               <Link to="/Moviespage" className="text-white">
//                 <li className="list-none">Movies</li>
//               </Link>
//               <Link to="/Tvshowpage" className="text-white">
//                 <li className="list-none">TV Shows</li>
//               </Link>
//               <Link to="/New&Popularpage" className="text-white">
//                 <li className="list-none">New & Popular</li>
//               </Link>
//               <Link to="/NetflixWishlistpage" className="text-white">
//                 <li className="list-none">My List</li>
//               </Link>
//             </nav>

//             <div>
//               <nav
//                 className={`transition-all duration-300 ease-in-out ${
//                   isMobileMenuOpen
//                     ? "opacity-100 -left-[145px]"
//                     : "opacity-0 -left-[875px]"
//                 } mob-vieww gap-[20px]  pb-[30px] w-[100vw] bg-black top-[45px] absolute font-NetflixSans items-center hidden`}
//               >
//                 {/* moblie Navigation */}

//                 <div className="flex gap-[10px] w-[92%] mb-[20px]">
//                   <input
//                     type="text"
//                     ref={searchtext}
//                     onChange={handleInputChange}
//                     placeholder="Search"
//                     className="w-full border border-white p-2 rounded bg-transparent text-white"
//                   />
//                   <button
//                     onClick={handleSearchButtonClick}
//                     className="text-white border px-[20px] py-2 rounded"
//                   >
//                     Search
//                   </button>
//                 </div>

//                 <Link to="/Homepage" className="text-white">
//                   <li className="nav-like py-2.5 list-none">Home</li>
//                 </Link>
//                 <Link to="/Moviespage" className="text-white">
//                   <li className="nav-like py-2.5 list-none">Movies</li>
//                 </Link>
//                 <Link to="/Tvshowpage" className="text-white">
//                   <li className="nav-like py-2.5 list-none">TV Shows</li>
//                 </Link>
//                 <Link to="/New&Popularpage" className="text-white">
//                   <li className="nav-like py-2.5 list-none">New & Popular</li>
//                 </Link>
//                 <Link to="/NetflixWishlistpage" className="text-white">
//                   <li className="nav-like py-2.5 list-none">My List</li>
//                 </Link>
//               </nav>
//             </div>

//             <div className="nav-icons-group flex items-center ">
//               <ul className="flex items-center gap-[15px]">
//                 <li onClick={toggleSearchBar} className="cursor-pointer">
//                   <CiSearch className="text-white w-[25px] h-[25px] hidden md:block" />
//                 </li>

//                 <div
//                   className={`${
//                     isSearchOpen
//                       ? "scale-100 opacity-100"
//                       : "scale-0 opacity-100"
//                   } web-view absolute bg-transparent mt-2 top-[-11px] flex items-center right-[14%] w-[300px] rounded-lg transition-all duration-300 ease-in-out transform origin-top gap-[15px]`}
//                 >
//                   <input
//                     type="text"
//                     ref={searchtext}
//                     onChange={handleInputChange}
//                     placeholder="Search"
//                     className="w-full border-white p-2 bg-transparent text-white rounded-md focus:ring-0 focus:border-red-900"
//                   />
//                   <button
//                     onClick={handleSearchButtonClick}
//                     className="text-white border px-[20px] py-2 rounded "
//                   >
//                     Search
//                   </button>
//                 </div>

//                 <Link
//                   className="relative hover:text-green-800"
//                   to="/NetflixWishFavoritepage"
//                 >
//                   <li>
//                     <MdOutlineFavorite className="text-white w-[23px] h-[23px]" />
//                   </li>
//                   {Favoriteitem.length > 0 && (
//                     <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
//                       {Favoriteitem.length}
//                     </span>
//                   )}
//                 </Link>
//                 <div>
//                   <div className="relative z-[45]">
//                     <div onClick={toggleDropdown} className="cursor-pointer">
//                       <li>
//                         <img
//                           src={navicon}
//                           alt="User Avatar"
//                           className="w-8 h-8 "
//                         />
//                       </li>
//                     </div>
//                     <div
//                       className={`absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out transform ${
//                         isOpen
//                           ? "opacity-100 scale-100"
//                           : "opacity-0 scale-95 pointer-events-none"
//                       }`}
//                     >
//                       <p className="text-gray-700 font-semibold">
//                         Username: {user?.username || "Guest"}
//                       </p>
//                       <p className="text-gray-600">
//                         Email: {user?.email || "Not available"}
//                       </p>
//                       <button
//                         onClick={handleLogout}
//                         className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </ul>
//             </div>
//           </div>
//           <div className="bar-icon-mobile hidden">
//             <FaBars
//               onClick={toggleMobileMenu}
//               className="text-[35px] text-white cursor-pointer"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;
