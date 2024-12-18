import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import miniimg from "../../assets/img/mini-img.png";
import { Navigation, Pagination } from "swiper/modules";
import { RiPlayLargeFill } from "react-icons/ri";
import { TfiPlus } from "react-icons/tfi";
import { SlLike } from "react-icons/sl";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { IoPlayCircleOutline } from "react-icons/io5";
import Preloader from "../Preloader";
import {
  getAiringTodayTVShow,
  getTvshowCedites,
  getTvshowDetails,
  getTvshowEpisode,
  getTvshowSeason,
  getTvshowTrailer,
} from "../Redux/features/Tvshow/TvshowSlice";
import { movieaddToWishlist, removeFromWishlist, tvshowaddToWishlist } from "../Redux/features/wishlist/wishlistSlice";
import { tvshowaddToFavoritelist } from "../Redux/features/favorite/FavoriteSlice";
import { FaMinus } from "react-icons/fa";

function TvshowAiringToday() {
  const dispatch = useDispatch();
  const {
    AiringTodayTVShow,
    selectedTvshowCedites,
    selectedTvshowDetails,
    TvshowEpisode,
    selectedTvshowseasonep,
    trailerKey,
    status,
    error,
  } = useSelector((state) => state.tvshow);

  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [selectedTvshow, setSelectedTvshow] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const wishlistitem = useSelector((state) => state.wishlistitem.items);


  useEffect(() => {
    dispatch(getAiringTodayTVShow());

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  if (isLoading === true) {
    return (
      <div className="main-preloader">
        <Preloader />
      </div>
    );
  }

  const handleSeasonSelect = (seasonId, seasonNumber) => {
    // console.log(
    //   "Dispatching with Season ID:",
    //   seasonId,
    //   "Season Number:",
    //   seasonNumber
    // );
    dispatch(getTvshowSeason({ seasonId, seasonNumber }));
  };

  const handleGetTrailer = async (tvshowId) => {
    try {
      setIsLoading(true);
      const preloaderPromise = new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
      const dataFetchPromise = (async () => {
        await dispatch(getTvshowCedites(tvshowId)).unwrap();
        await dispatch(getTvshowDetails(tvshowId)).unwrap();
        await dispatch(getTvshowEpisode(tvshowId)).unwrap();
        return await dispatch(getTvshowTrailer(tvshowId)).unwrap();
      })();

      const trailerResult = await Promise.all([
        preloaderPromise,
        dataFetchPromise,
      ]).then(([, trailerResult]) => trailerResult);
      
      setIsLoading(false);

      if (trailerResult) {
        setPopupIsOpen(true);
      } else {
        console.error("Trailer not available for this tvshow.");
      }
    } catch (error) {
      console.error("Error fetching tvshow data:", error);
      setIsLoading(false);
    }
  };

  let youtubeTrailer = trailerKey;

  // console.log("trailerKeyyyyyyyyyyy", youtubeTrailer);

  if (error) {
    return <p>Error: {error}</p>;
  }

  let handlegenres = selectedTvshowDetails.genres;

  // console.log("handlegenres", handlegenres);

  let voteAverage = selectedTvshowDetails.vote_average;
  // console.log("voteAverage", voteAverage);

  // console.log("selectedTvshowAiring", selectedTvshow);
  // console.log("selectedTvshowDetailsAiring" , selectedTvshowDetails);
  

  function getRatingCategory() {
    if (voteAverage >= 0 && voteAverage <= 4.0) {
      return "Poor";
    } else if (voteAverage > 4.0 && voteAverage <= 6.0) {
      return "below the average";
    } else if (voteAverage > 6.0 && voteAverage <= 7.5) {
      return "Good";
    } else if (voteAverage > 7.5 && voteAverage <= 10.0) {
      return "Excellent";
    } else {
      return "Invalid rating";
    }
  }
  const rating = getRatingCategory(voteAverage);

  // console.log(rating);

  const closePopup = () => {
    setPopupIsOpen(false);
    setShowTrailer(false);
    setTimeout(() => setSelectedTvshow(null), 500);
  };

  const totalepisodes = selectedTvshowDetails.number_of_episodes;
  const totalseasons = selectedTvshowDetails.number_of_seasons;
  let seasonname = selectedTvshowDetails.seasons;

  // console.log("selectedTvshowDetailsair", selectedTvshowDetails);
  let tvshowseasonid = selectedTvshowDetails.id;
  // console.log("tvshowseasonid", tvshowseasonid);

  // console.log("totalepisodes", totalepisodes);
  // console.log("totalseasons", totalseasons);

  const handleEpisodeClick = (episode, tvshowid) => {
    handleGetTrailer(tvshowid);
    setSelectedTvshow(episode);
    // console.log("Episode:", episode);
  };

  // console.log("selectedTvshowDetails", selectedTvshowDetails);

  let runtime = selectedTvshowDetails.runtime;
  runtime = parseInt(runtime);

  let hours = Math.floor(runtime / 60);
  let minutes = runtime % 60;

  let currentepisodesnumber = selectedTvshow?.episode_number;
  let currentseasonsnumber = selectedTvshow?.season_number;

  // console.log("currentepisodesnumber", currentepisodesnumber);
  // console.log("currentseasonsnumber", currentseasonsnumber);

  // console.log("selectedTvshowseasonep", selectedTvshowseasonep);

  let Tvshowseasonepisodes = selectedTvshowseasonep.episodes;
  // console.log("Tvshowseasonepisodes", Tvshowseasonepisodes);

  const year = new Date(selectedTvshowDetails.first_air_date).getFullYear();
  const showStatus = year === 2024 ? "New" : "Old";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";


  const isInWishlist = wishlistitem.some((item) => item.id === selectedTvshow?.id);

  const handleWishlist = (tvshow) => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(tvshow)); // Remove from wishlist
    } else {
      dispatch(movieaddToWishlist(tvshow)); // Add to wishlist
    }
  };

  const hendleFavoritelist = (tvshow) => {
    dispatch(tvshowaddToFavoritelist(tvshow));
    // console.log("Favorite tvshow", tvshow);
  };

  const getDescriptionLength = () => {
    if (windowWidth < 380) {
      return 30;
    } else if (windowWidth < 576) {
      return 50;
    } else if (windowWidth < 768) {
      return 50;
    } else if (windowWidth < 1080) {
      return 60;
    } else {
      return 120;
    }
  };

  return (
    <div className="netflix-pages mt-[40px] row MovieandTvshowTrendingRow overflow-hidden md:container md:mx-auto">
      <div className="Trending-Today min-h-[235px]">
        <div className="Trending-Today-title-div mb-[40px] flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
                AiringToday TVShow
              </h1>
            </div>
          </div>
        </div>
        <div className="">
          <Swiper
            pagination={true}
            navigation={true}
            modules={[Pagination, Navigation]}
            slidesPerView={6}
            spaceBetween={8}
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                spaceBetween: 8,
              },
              480: {
                slidesPerView: 2.5,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 15,
              },
              1440: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            }}
            className="mySwiper"
          >
            <div className="flex gap-[10px]">
              {AiringTodayTVShow?.filter((tvshow) => tvshow.backdrop_path).map((tvshow, index) => (
                <SwiperSlide key={`${tvshow.id}-${index}`}>
                  <div className="main-cart rounded-lg overflow-hidden shadow-main">
                    <div className="main-cart-inner w-full rounded-lg relative">
                      <div className="mini-img w-[11px] h-[20px] absolute left-[10px] top-[10px]">
                        <img src={miniimg} alt="Mini" />
                      </div>
                      <div className="web-view">
                        <img
                          src={`${imageBaseUrl}${tvshow.backdrop_path}`}
                          alt={tvshow.title}
                          onClick={() => {
                            handleGetTrailer(tvshow.id);
                            setSelectedTvshow(tvshow);
                          }}
                          className="w-full h-[180px] object-cover cursor-pointer"
                        />
                      </div>
                      <div className="mobile-view hidden">
                        <img
                          src={`${imageBaseUrl}${tvshow.poster_path}`}
                          alt={tvshow.title}
                          onClick={() => {
                            handleGetTrailer(tvshow.id); // Fetches the trailer
                            setSelectedTvshow(tvshow); 
                          }}
                          onMouseEnter={async () => {
                            setHoveredMovieId(tvshow.id); // Set hovered movie ID

                            try {
                              await dispatch(
                                getTvshowDetails(tvshow.id)
                              ).unwrap();
                              await dispatch(
                                getMovieCertifications(tvshow.id)
                              ).unwrap();
                            } catch (error) {
                              console.error(
                                "Error fetching movie details or certifications:",
                                error
                              );
                            }
                          }}
                          onMouseLeave={() => setHoveredMovieId(null)} // Clear on mouse leave
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="img-inner-text absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
                        <h1>
                          {tvshow?.name.length > 13
                            ? `${tvshow.name.slice(0, 13)}...`
                            : tvshow.name}
                        </h1>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>

      {/* Popup for selected movie */}
      {selectedTvshow && popupIsOpen && (
        <div className="mx-auto rounded">
          <div className="selectedMovie-section bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
            <div className="absolute top-3 right-3 z-10">
              <button onClick={closePopup}>
                <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
              </button>
            </div>
            <div className="selectedMovie-sub-section relative min-h-[800px]">
              <div className="selectedMovie-play-section h-[480px] shadow-main">
                {showTrailer ? (
                  youtubeTrailer ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeTrailer}?autoplay=1&rel=0&modestbranding=1`}
                      title={selectedTvshow.title || "Trailer"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      sandbox="allow-same-origin allow-scripts allow-presentation"
                      allowFullScreen
                      className="z-[1] relative"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                      <p>No trailer available</p>
                    </div>
                  )
                ) : (
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${
                      selectedTvshow.backdrop_path ||
                      selectedTvshow.still_path ||
                      "/default-image-path.jpg"
                    }`}
                    alt={selectedTvshow.title || "Default Title"}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Movie details and similar movies section */}
              <div className="selectedMovie-details-section absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
                <h1 className="selectedMovie-details-section-h1 text-3xl font-bold">{selectedTvshow.name}</h1>
                <div className="selectedMovie-details-section-icon flex items-center mt-[40px]">
                  <div className="flex">
                    <button
                      onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
                      className="play-btn bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
                    >
                      <span>
                        <RiPlayLargeFill className="w-[25px] h-[25px]" />
                      </span>
                      {showTrailer ? "Stop" : "Play"}
                    </button>
                  </div>

                  <div className="gap-[10px] flex">

                    {/* <button
                      onClick={() => hendlewishlist(selectedTvshow)}
                      className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] items-center justify-center ease-linear flex border-[#ffffff]/50"
                    >
                      <TfiPlus className="wishlistbtn-icon w-5 h-5" />
                    </button> */}

{isInWishlist ? (
                      <button
                        onClick={() => handleWishlist(selectedTvshow)}
                        className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] items-center justify-center ease-linear flex border-[#ffffff]/50"
                      >
                        <FaMinus className="wishlistbtn-icon w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleWishlist(selectedTvshow)}
                        className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] items-center justify-center ease-linear flex border-[#ffffff]/50"
                      >
                        <TfiPlus className="wishlistbtn-icon w-5 h-5" />
                      </button>
                    )}

                    <button
                    onClick={() => hendleFavoritelist(selectedTvshow)}
                    className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
                      <SlLike className="wishlistbtn-icon w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Additional movie info */}

                <div className="mt-[60px] selectedMovie-details-sub-section flex justify-between">
                  <div className="selectedMovie-details-sub-section-left w-[60%]">
                    <div className="flex items-center space-x-4">
                      <span
                        className={`font-NetflixSans ${
                          year === 2024 ? "text-[#46d369]" : "text-[#d9534f]"
                        }`}
                      >
                        {year === 2024 ? "New" : "Old"}
                      </span>
                      <div className="text-[#bcbcbc] flex gap-[8px] items-center">
                        <div>
                          {currentseasonsnumber === undefined ||
                          currentseasonsnumber === null ||
                          currentseasonsnumber === "" ||
                          currentepisodesnumber === undefined ||
                          currentepisodesnumber === null ||
                          currentepisodesnumber === "" ? (
                            <div className="text-[#bcbcbc] font-NetflixSans flex gap-[8px] items-center">
                              <span className="">{year}</span>
                              <span>{totalseasons} seasons</span>
                              <span>{totalepisodes} Episodes</span>
                              <div className="flex items-center justify-center w-[35px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
                                <span className="text-white text-[14px]">
                                  HD
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[#bcbcbc] font-NetflixSans flex gap-[8px] items-center">
                              <span className="">{year}</span>
                              <span>Seasons {currentseasonsnumber}</span>
                              <span>Episodes {currentepisodesnumber}</span>
                              <div className="flex items-center justify-center w-[35px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
                                <span className="text-white text-[14px]">
                                  HD
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-[20px]">Tvshow</p>
                    <p className="mt-4 text-[16px]">
                      {selectedTvshow.overview.length > 100
                        ? `${selectedTvshow.overview.slice(0, 100)}...`
                        : selectedTvshow.overview}
                    </p>
                  </div>

                  <div className="selectedMovie-details-sub-section-right w-[33%]">
                    <div className="cast-section flex flex-wrap items-center gap-1">
                      <h2 className="text-white flex flex-wrap gap-[5px] items-center">
                        Cast :
                        {selectedTvshowCedites.slice(0, 4).map((item, ind) => {
                          return (
                            <p
                              key={ind}
                              className="text-[14px] text-justify text-[#777777]"
                            >
                              {item.name}
                              {ind < 3 && ","}
                            </p>
                          );
                        })}
                      </h2>
                    </div>

                    <div className="genres-section flex flex-wrap items-center gap-1 my-[12px]">
                      <h2 className="text-white flex flex-wrap gap-[5px] items-center">
                        Genres :
                        {handlegenres.map((item, ind) => {
                          return (
                            <p
                              key={ind}
                              className="text-[14px] text-justify text-[#777777]"
                            >
                              {item.name}
                              {ind < 2 && ","}
                            </p>
                          );
                        })}
                      </h2>
                    </div>

                    <div className="rating-section flex flex-wrap items-center gap-1 my-[12px]">
                      <h2 className="text-white">This Tvshow is :</h2>
                      <p className="text-[14px] text-justify text-[#777777]">
                        {rating}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="selectedMovie-Similar-section mt-4 p-12 pt-0">
              <div className="flex justify-between">
                <div className="selectedMovie-Similar-title-section mb-[50px]">
                  <h2 className="text-2xl font-bold">Tv Show</h2>
                </div>

                <div>
                  <select
                    className="rounded px-[15px] py-[8px] bg-[#242424]"
                    id="mySelect"
                    defaultValue=""
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value, 10); // Get the selected option's ID as an integer
                      const filteredSeasons = seasonname.filter(
                        (item) => item.name !== "Specials"
                      );
                      const selectedSeasonIndex = filteredSeasons.findIndex(
                        (item) => item.id === selectedId
                      );

                      if (selectedSeasonIndex !== -1) {
                        const seasonNumber = selectedSeasonIndex + 1; // Calculate seasonNumber as index + 1
                        handleSeasonSelect(tvshowseasonid, seasonNumber); // Pass only seasonNumber
                      } else {
                        console.warn(
                          "No matching season found for the selected ID"
                        );
                      }
                    }}
                  >
                    <option value="" disabled selected>
                      Select a Season
                    </option>
                    {seasonname
                      .filter((item) => item.name !== "Specials") // Exclude "Specials"
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-2 space-y-4">
                <div className="overflow-y-auto h-[400px]">
                  <h1>Episodes</h1>
                  {Tvshowseasonepisodes && Tvshowseasonepisodes.length > 0 ? (
                    Tvshowseasonepisodes.slice(0, 10).map((Tvshow, ind) => {
                      return (
                        <div
                          key={Tvshow.id}
                          onClick={() =>
                            handleEpisodeClick(Tvshow, Tvshow.show_id)
                          }
                          className="selectedMovie-Similar-row flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]"
                        >
                          <div className="selectedMovie-Similar-row-count h-[70px] flex items-center">
                            <h1 className="text-[24px]">{ind + 1}</h1>
                          </div>
                          <div className="selectedMovie-Similar-row-sub flex w-full items-center justify-between gap-[15px]">
                            <div
                              className={`selectedMovie-Similar-row-img h-[70px] w-[21%] ${
                                new Date(Tvshow.air_date) > new Date()
                                  ? "hidden"
                                  : ""
                              }`}
                            >
                              <img
                                src={`${imageBaseUrl}${Tvshow.still_path}`}
                                alt={Tvshow.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="selectedMovie-Similar-row-sub-detail w-[75%] ">
                              <div className="selectedMovie-Similar-row-name flex items-center justify-between">
                                <h3 className="text-white font-normal">
                                  {Tvshow.name}
                                </h3>
                              </div>
                              <p className="selectedMovie-Similar-row-overview text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
                                {new Date(Tvshow.air_date) > new Date()
                                  ? `Upcoming (${Tvshow.air_date})`
                                  : Tvshow.overview
                                  ? Tvshow.overview.substring(
                                      0,
                                      getDescriptionLength()
                                    ) + " ..."
                                  : "Upcoming"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center py-[34px] text-[#d2d2d2]">
                      No tvshow episode found.
                    </div>
                  )}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TvshowAiringToday;




// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getMovieCertifications,
//   getTrendingTvshow,
// } from "../Redux/features/movies/movieSlice";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import miniimg from "../../assets/img/mini-img.png";
// import { Navigation, Pagination } from "swiper/modules";
// import { RiPlayLargeFill } from "react-icons/ri";
// import { TfiPlus } from "react-icons/tfi";
// import { SlLike } from "react-icons/sl";
// import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
// import { IoPlayCircleOutline } from "react-icons/io5";
// import Preloader from "../Preloader";
// import {
//   getTvshowCedites,
//   getTvshowDetails,
//   getTvshowEpisode,
//   getTvshowSeason,
//   getTvshowTrailer,
// } from "../Redux/features/Tvshow/TvshowSlice";
// import { tvshowaddToWishlist } from "../Redux/features/wishlist/wishlistSlice";

// function TvshowAiringToday() {
//   const dispatch = useDispatch();
//   const {
//     Trendingtvshow,
//     selectedTvshowCedites,
//     selectedTvshowDetails,
//     selectedMovieCertifications,
//     // SimilarMovies,
//     TvshowEpisode,
//     selectedTvshowseasonep,
//     trailerKey,
//     status,
//     error,
//   } = useSelector((state) => state.tvshow);

//   const [popupIsOpen, setPopupIsOpen] = useState(false);
//   const [selectedTvshow, setSelectedTvshow] = useState(null);
//   const [selectedEpisode, setSelectedEpisode] = useState(null);
//   const [showTrailer, setShowTrailer] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoveredMovieId, setHoveredMovieId] = useState(null); // Track hovered movie's ID
//   const [timeWindow, setTimeWindow] = useState("day");
//   const [isLoading, setIsLoading] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     dispatch(getTrendingTvshow());

//     // handleSeasonSelect()

//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [dispatch]);

//   if (isLoading === true) {
//     return (
//       <div className="main-preloader">
//         <Preloader />
//       </div>
//     );
//   }

//   const handleSeasonSelect = (seasonId, seasonNumber) => {
//     console.log(
//       "Dispatching with Season ID:",
//       seasonId,
//       "Season Number:",
//       seasonNumber
//     );
//     dispatch(getTvshowSeason({ seasonId, seasonNumber }));
//   };

//   const handleGetTrailer = async (tvshowId) => {
//     try {
//       setIsLoading(true);

//       // Ensure the preloader shows for at least 5 seconds
//       const preloaderPromise = new Promise((resolve) =>
//         setTimeout(resolve, 2000)
//       );
//       const dataFetchPromise = (async () => {
//         await dispatch(getTvshowCedites(tvshowId)).unwrap();
//         await dispatch(getTvshowDetails(tvshowId)).unwrap();
//         await dispatch(getTvshowEpisode(tvshowId)).unwrap();
//         // await dispatch(getMovieCertifications(tvshowId)).unwrap();
//         return await dispatch(getTvshowTrailer(tvshowId)).unwrap();
//       })();

//       const trailerResult = await Promise.all([
//         preloaderPromise,
//         dataFetchPromise,
//       ]).then(([, trailerResult]) => trailerResult);

//       setIsLoading(false);

//       if (trailerResult) {
//         setPopupIsOpen(true);
//       } else {
//         console.error("Trailer not available for this tvshow.");
//       }
//     } catch (error) {
//       console.error("Error fetching tvshow data:", error);
//       setIsLoading(false);
//     }
//   };

//   console.log("Trendingtvshow", Trendingtvshow);

//   let youtubeTrailer = trailerKey;

//   console.log("trailerKeyyyyyyyyyyy", youtubeTrailer);

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   let handlegenres = selectedTvshowDetails.genres;

//   console.log("handlegenres", handlegenres);

//   let voteAverage = selectedTvshowDetails.vote_average;
//   console.log("voteAverage", voteAverage);

//   console.log("selectedTvshowDetails", selectedTvshow);

//   function getRatingCategory() {
//     if (voteAverage >= 0 && voteAverage <= 4.0) {
//       return "Poor";
//     } else if (voteAverage > 4.0 && voteAverage <= 6.0) {
//       return "below the average";
//     } else if (voteAverage > 6.0 && voteAverage <= 7.5) {
//       return "Good";
//     } else if (voteAverage > 7.5 && voteAverage <= 10.0) {
//       return "Excellent";
//     } else {
//       return "Invalid rating";
//     }
//   }
//   const rating = getRatingCategory(voteAverage);

//   console.log(rating);

//   const closePopup = () => {
//     setPopupIsOpen(false);
//     setShowTrailer(false);
//     setTimeout(() => setSelectedTvshow(null), 500);
//   };

//   const totalepisodes = selectedTvshowDetails.number_of_episodes;
//   const totalseasons = selectedTvshowDetails.number_of_seasons;
//   let seasonname = selectedTvshowDetails.seasons;

//   console.log("selectedTvshowDetails", selectedTvshowDetails);
//   let tvshowseasonid = selectedTvshowDetails.id;
//   console.log("tvshowseasonid", tvshowseasonid);

//   console.log("totalepisodes", totalepisodes);
//   console.log("totalseasons", totalseasons);



//   const handleEpisodeClick = (episode, tvshowid) => {
//     handleGetTrailer(tvshowid);
//     setSelectedTvshow(episode);
//     console.log("Episode:", episode);
//   };

//   console.log("cdsc", selectedTvshowDetails);

//   let runtime = selectedTvshowDetails.runtime; // Assuming runtime is a string like "92min"
//   runtime = parseInt(runtime); // Convert string to number

//   let hours = Math.floor(runtime / 60); // Calculate hours
//   let minutes = runtime % 60;
//   // Calculate remaining minutes

//   let currentepisodesnumber = selectedTvshow?.episode_number;
//   let currentseasonsnumber = selectedTvshow?.season_number;

//   console.log("currentepisodesnumber", currentepisodesnumber);
//   console.log("currentseasonsnumber", currentseasonsnumber);

//   console.log("selectedTvshowseasonep", selectedTvshowseasonep);

//   let Tvshowseasonepisodes = selectedTvshowseasonep.episodes;
//   console.log("Tvshowseasonepisodes", Tvshowseasonepisodes);

//   const year = new Date(selectedTvshowDetails.first_air_date).getFullYear();
//   const showStatus = year === 2024 ? "New" : "Old";
//   const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Add base URL\

//   const hendlewishlist = (tvshow) => {
//     dispatch(tvshowaddToWishlist(tvshow));
//     console.log("wishlist tvshow", tvshow);
//   };

//   const getDescriptionLength = () => {
//     if (windowWidth < 380) {
//       return 30;
//     } else if (windowWidth < 576) {
//       return 50;
//     } else if (windowWidth < 768) {
//       return 50;
//     } else if (windowWidth < 1080) {
//       return 60;
//     } else {
//       return 120;
//     }
//   };

//   return (
//     <div className="row MovieandTvshowTrendingRow overflow-hidden md:container md:mx-auto">
//       <div className="Trending-Today min-h-[235px]">
//         <div className="Trending-Today-title-div mb-[40px] flex items-center justify-between">
//           <div className="">
//             <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//               Tvshow Trending 
//             </h1>
//           </div>
//         </div>
//         <div className="">
//           <Swiper
//             pagination={true}
//             navigation={true}
//             modules={[Pagination, Navigation]}
//             slidesPerView={6}
//             spaceBetween={8}
//             breakpoints={{
//               320: {
//                 slidesPerView: 1.5,
//                 spaceBetween: 8,
//               },
//               480: {
//                 slidesPerView: 2.5,
//                 spaceBetween: 10,
//               },
//               768: {
//                 slidesPerView: 3,
//                 spaceBetween: 12,
//               },
//               1024: {
//                 slidesPerView: 5,
//                 spaceBetween: 15,
//               },
//               1440: {
//                 slidesPerView: 6,
//                 spaceBetween: 20,
//               },
//             }}
//             className="mySwiper"
//           >
//             <div className="flex gap-[10px]">
//               {Trendingtvshow?.map((tvshow, index) => (
//                 <SwiperSlide key={`${tvshow.id}-${index}`}>
//                   <div className="main-cart rounded-lg overflow-hidden shadow-main">
//                     <div className="main-cart-inner w-full rounded-lg relative">
//                       <div className="mini-img w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                         <img src={miniimg} alt="Mini" />
//                       </div>
//                       <div className="web-view">
//                         <img
//                           src={`${imageBaseUrl}${tvshow.backdrop_path}`}
//                           alt={tvshow.title}
//                           onClick={() => {
//                             handleGetTrailer(tvshow.id);
//                             setSelectedTvshow(tvshow);
//                           }}
                         
//                           className="w-full h-[180px] object-cover cursor-pointer"
//                         />
//                       </div>
//                       <div className="mobile-view hidden">
//                         <img
//                           src={`${imageBaseUrl}${tvshow.poster_path}`}
//                           alt={tvshow.title}
//                           onClick={() => {
//                             handleGetTrailer(tvshow.id); // Fetches the trailer
//                             setSelectedTvshow(tvshow); // Sets the selected movie
//                           }}
//                           onMouseEnter={async () => {
//                             setHoveredMovieId(tvshow.id); // Set hovered movie ID

//                             try {
//                               // Dispatch multiple actions one by one or use Promise.all for parallel dispatch
//                               await dispatch(
//                                 getTvshowDetails(tvshow.id)
//                               ).unwrap();
//                               await dispatch(
//                                 getMovieCertifications(tvshow.id)
//                               ).unwrap(); // .unwrap() is used to handle the promise result or errors
//                             } catch (error) {
//                               console.error(
//                                 "Error fetching movie details or certifications:",
//                                 error
//                               );
//                             }
//                           }}
//                           onMouseLeave={() => setHoveredMovieId(null)} // Clear on mouse leave
//                           className="cursor-pointer"
//                         />
//                       </div>
//                       <div className="img-inner-text absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                         <h1>
//                           {tvshow?.name.length > 13
//                             ? `${tvshow.name.slice(0, 13)}...`
//                             : tvshow.name}
//                         </h1>
//                       </div>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </div>
//           </Swiper>
//         </div>
//       </div>

//       {/* Popup for selected movie */}
//       {selectedTvshow && popupIsOpen && (
//         <div className="mx-auto rounded">
//           <div className="selectedMovie-section bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
//             <div className="absolute top-3 right-3 z-10">
//               <button onClick={closePopup}>
//                 <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
//               </button>
//             </div>
//             <div className="selectedMovie-sub-section relative min-h-[800px]">
//               <div className="selectedMovie-play-section h-[480px] shadow-main">
//                 {showTrailer ? (
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     src={`https://www.youtube.com/embed/${youtubeTrailer}?autoplay=1&rel=0&modestbranding=1`}
//                     title={selectedTvshow.title}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     sandbox="allow-same-origin allow-scripts allow-presentation"
//                     allowFullScreen
//                     className="z-[1] relative"
//                   ></iframe>
//                 ) : (
//                   <img
//                     src={`https://image.tmdb.org/t/p/w1280${
//                       selectedTvshow.backdrop_path ||
//                       selectedTvshow.still_path ||
//                       "/default-image-path.jpg"
//                     }`}
//                     alt={selectedTvshow.title || "Default Title"}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>

//               {/* Movie details and similar movies section */}
//               <div className="selectedMovie-details-section absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
//                 <h1 className="text-3xl font-bold">{selectedTvshow.name}</h1>
//                 <div className="selectedMovie-details-section-icon flex items-center mt-[40px]">
//                   <div className="flex">
//                     <button
//                       onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
//                       className="play-btn bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
//                     >
//                       <span>
//                         <RiPlayLargeFill className="w-[25px] h-[25px]" />
//                       </span>
//                       {showTrailer ? "Stop" : "Play"}
//                     </button>
//                   </div>

//                   <div className="gap-[10px] flex">
//                     <button
//                       onClick={() => hendlewishlist(selectedTvshow)}
//                       className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] items-center justify-center ease-linear flex border-[#ffffff]/50"
//                     >
//                       <TfiPlus className="wishlistbtn-icon w-5 h-5" />
//                     </button>

//                     <button className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
//                       <SlLike className="wishlistbtn-icon w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Additional movie info */}

//                 <div className="mt-[60px] selectedMovie-details-sub-section flex justify-between">
//                   <div className="selectedMovie-details-sub-section-left w-[60%]">
//                     <div className="flex items-center space-x-4">
//                       <span
//                         className={`font-NetflixSans ${
//                           year === 2024 ? "text-[#46d369]" : "text-[#d9534f]"
//                         }`}
//                       >
//                         {year === 2024 ? "New" : "Old"}
//                       </span>
//                       <div className="text-[#bcbcbc] flex gap-[8px] items-center">
//                         <div>
//                           {currentseasonsnumber === undefined ||
//                           currentseasonsnumber === null ||
//                           currentseasonsnumber === "" ||
//                           currentepisodesnumber === undefined ||
//                           currentepisodesnumber === null ||
//                           currentepisodesnumber === "" ? (
//                             <div className="text-[#bcbcbc] font-NetflixSans flex gap-[8px] items-center">
//                               <span className="">{year}</span>
//                               <span>{totalseasons} seasons</span>
//                               <span>{totalepisodes} Episodes</span>
//                               <div className="flex items-center justify-center w-[35px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
//                                 <span className="text-white text-[14px]">
//                                   HD
//                                 </span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="text-[#bcbcbc] font-NetflixSans flex gap-[8px] items-center">
//                               <span className="">{year}</span>
//                               <span>Seasons {currentseasonsnumber}</span>
//                               <span>Episodes {currentepisodesnumber}</span>
//                               <div className="flex items-center justify-center w-[35px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
//                                 <span className="text-white text-[14px]">
//                                   HD
//                                 </span>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <p className="mt-2 text-[20px]">Tvshow</p>
//                     <p className="mt-4 text-[16px]">
//                       {selectedTvshow.overview.length > 100
//                         ? `${selectedTvshow.overview.slice(0, 100)}...`
//                         : selectedTvshow.overview}
//                     </p>
//                   </div>

//                   <div className="selectedMovie-details-sub-section-right w-[33%]">
//                     <div className="cast-section flex flex-wrap items-center gap-1">
//                       <h2 className="text-white flex flex-wrap gap-[5px] items-center">
//                         Cast :
//                         {selectedTvshowCedites.slice(0, 4).map((item, ind) => {
//                           return (
//                             <p
//                               key={ind}
//                               className="text-[14px] text-justify text-[#777777]"
//                             >
//                               {item.name}
//                               {ind < 3 && ","}
//                             </p>
//                           );
//                         })}
//                       </h2>
//                     </div>

//                     <div className="genres-section flex flex-wrap items-center gap-1 my-[12px]">
//                       <h2 className="text-white flex flex-wrap gap-[5px] items-center">
//                         Genres :
//                         {handlegenres.map((item, ind) => {
//                           return (
//                             <p
//                               key={ind}
//                               className="text-[14px] text-justify text-[#777777]"
//                             >
//                               {item.name}
//                               {ind < 2 && ","}
//                             </p>
//                           );
//                         })}
//                       </h2>
//                     </div>

//                     <div className="rating-section flex flex-wrap items-center gap-1 my-[12px]">
//                       <h2 className="text-white">This Tvshow is :</h2>
//                       <p className="text-[14px] text-justify text-[#777777]">
//                         {rating}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="selectedMovie-Similar-section mt-4 p-12 pt-0">
//               <div className="flex justify-between">
//                 <div className="selectedMovie-Similar-title-section mb-[50px]">
//                   <h2 className="text-2xl font-bold">Tv Show</h2>
//                 </div>

//                 <div>
//                   <select
//                     className="rounded px-[15px] py-[8px] bg-[#242424]"
//                     id="mySelect"
//                     defaultValue=""
//                     onChange={(e) => {
//                       const selectedId = parseInt(e.target.value, 10); // Get the selected option's ID as an integer
//                       const filteredSeasons = seasonname.filter(
//                         (item) => item.name !== "Specials"
//                       );
//                       const selectedSeasonIndex = filteredSeasons.findIndex(
//                         (item) => item.id === selectedId
//                       );

//                       if (selectedSeasonIndex !== -1) {
//                         const seasonNumber = selectedSeasonIndex + 1; // Calculate seasonNumber as index + 1
//                         handleSeasonSelect(tvshowseasonid, seasonNumber); // Pass only seasonNumber
//                       } else {
//                         console.warn(
//                           "No matching season found for the selected ID"
//                         );
//                       }
//                     }}
//                   >
//                     <option value="" disabled selected>
//                       Select a Season
//                     </option>
//                     {seasonname
//                       .filter((item) => item.name !== "Specials") // Exclude "Specials"
//                       .map((item) => (
//                         <option key={item.id} value={item.id}>
//                           {item.name}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-2 space-y-4">
//                 <div className="overflow-y-auto h-[400px]">
//                   <h1>Episodes</h1>
//                   {Tvshowseasonepisodes && Tvshowseasonepisodes.length > 0 ? (
//                     Tvshowseasonepisodes.slice(0, 10).map((Tvshow, ind) => {
//                       return (
//                         <div
//                           key={Tvshow.id}
//                           onClick={() =>
//                             handleEpisodeClick(Tvshow, Tvshow.show_id)
//                           }
//                           className="selectedMovie-Similar-row flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]"
//                         >
//                           <div className="selectedMovie-Similar-row-count h-[70px] flex items-center">
//                             <h1 className="text-[24px]">{ind + 1}</h1>
//                           </div>
//                           <div className="selectedMovie-Similar-row-sub flex w-full items-center justify-between gap-[15px]">
//                             <div className={`selectedMovie-Similar-row-img h-[70px] w-[21%] ${
//                               new Date(Tvshow.air_date) > new Date()
//                                 ? "hidden"
//                                 : ""
//                             }`}>
//                               <img
//                                 src={`${imageBaseUrl}${Tvshow.still_path}`}
//                                 alt={Tvshow.title}
//                                 className="w-full h-full object-cover rounded-lg"
//                               />
//                             </div>
//                             <div className="selectedMovie-Similar-row-sub-detail w-[75%] ">
//                               <div className="selectedMovie-Similar-row-name flex items-center justify-between">
//                                 <h3 className="text-white font-normal">
//                                   {Tvshow.name}
//                                 </h3>
//                               </div>
//                               <p className="selectedMovie-Similar-row-overview text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
//                                 {new Date(Tvshow.air_date) > new Date()
//                                   ? `Upcoming (${Tvshow.air_date})`
//                                   : Tvshow.overview
//                                   ? Tvshow.overview.substring(
//                                       0,
//                                       getDescriptionLength()
//                                     ) + " ..."
//                                   : "Upcoming"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="flex items-center justify-center py-[34px] text-[#d2d2d2]">
//                       No tvshow episode found.
//                     </div>
//                   )}{" "}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TvshowAiringToday;










// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import miniimg from "../../assets/img/mini-img.png";
// import { Navigation, Pagination } from "swiper/modules";
// import { RiPlayLargeFill } from "react-icons/ri";
// import { TfiPlus } from "react-icons/tfi";
// import { SlLike } from "react-icons/sl";
// import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
// import { IoPlayCircleOutline } from "react-icons/io5";
// import Preloader from "../Preloader"; // Import Preloader
// import {
//   getAiringTodayTVShow,
//   getTvshowCedites,
//   getTvshowDetails,
//   getTvshowTrailer,
// } from "../Redux/features/Tvshow/TvshowSlice";

// function TvshowAiringToday() {
//   const dispatch = useDispatch();
//   const {
//     AiringTodayTVShow,
//     selectedTvshowCedites,
//     selectedTvshowDetails,
//     trailerKey,
//     status,
//     error,
//   } = useSelector((state) => state.tvshow);
//   const [popupIsOpen, setPopupIsOpen] = useState(false);
//   const [selectedTvshow, setSelectedTvshow] = useState(null);
//   const [showTrailer, setShowTrailer] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoveredMovieId, setHoveredMovieId] = useState(null);

//   useEffect(() => {
//     dispatch(getAiringTodayTVShow());
//   }, [dispatch]);

//   // const handleGetTrailer = async (tvshowId) => {
//   //   try {
//   //     await dispatch(getTvshowCedites(tvshowId)).unwrap();
//   //     await dispatch(getTvshowDetails(tvshowId)).unwrap();
//   //     const trailerResult = await dispatch(getTvshowTrailer(tvshowId)).unwrap();

//   //     if (trailerResult) {
//   //       setPopupIsOpen(true);
//   //     } else {
//   //       console.error("Trailer not available for this movie.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching movie data:", error);
//   //   }
//   // };

//   const handleGetTrailer = async (tvshowId) => {
//     try {
//       await dispatch(getTvshowCedites(tvshowId)).unwrap();
//       await dispatch(getTvshowDetails(tvshowId)).unwrap();
//       const trailerResult = await dispatch(getTvshowTrailer(tvshowId)).unwrap();

//       setPopupIsOpen(true); // Open the popup regardless of trailer availability

//       if (trailerResult) {
//         setShowTrailer(true); // Trailer is available, set to true
//       } else {
//         setShowTrailer(true); // Trailer not available, set to false
//         console.error("Trailer not available for this TV show.");
//       }
//     } catch (error) {
//       console.error("Error fetching TV show data:", error);
//     }
//   };

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   let handlegenres = selectedTvshowDetails.genres;
//   // console.log("hendlegenres", handlegenres);

//   let voteAverage = selectedTvshowDetails.vote_average;
//   console.log("voteAverage", voteAverage);

//   function getRatingCategory() {
//     if (voteAverage >= 0 && voteAverage <= 4.0) {
//       return "Poor";
//     } else if (voteAverage > 4.0 && voteAverage <= 6.0) {
//       return "below the average";
//     } else if (voteAverage > 6.0 && voteAverage <= 7.5) {
//       return "Good";
//     } else if (voteAverage > 7.5 && voteAverage <= 10.0) {
//       return "Excellent";
//     } else {
//       return "Invalid rating"; // For values outside 0-10
//     }
//   }
//   const rating = getRatingCategory(voteAverage);

//   console.log(rating);

//   const closePopup = () => {
//     setPopupIsOpen(false);
//     setShowTrailer(false);
//     setTimeout(() => setSelectedTvshow(null), 500);
//   };

//   console.log("AiringTodayTVShow", AiringTodayTVShow);

//   console.log("selectedMovieCedite", selectedTvshowCedites);
//   console.log("selectedTvshowDetails", selectedTvshowDetails);

//   let total_season = selectedTvshowDetails.number_of_seasons;
//   console.log("total_season", total_season);

//   let numberofseason = selectedTvshowDetails.seasons;
//   console.log("numberofseason", numberofseason);

//   // let hours = Math.floor(runtime / 60); // Calculate hours
//   // let minutes = runtime % 60; // Calculate remaining minutes

//   const year = new Date(selectedTvshowDetails.release_date).getFullYear();
//   // console.log("year", year);

//   // console.log(`Runtime: ${hours}h ${minutes}m`);

//   const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Add base URL

//   return (
//     <div className="row MovieandTvshowTrendingRow overflow-hidden">
//       <div className="Trending-Today h-screen">
//         <div className="mb-[20px]">
//           <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//             Today Top 10 Tv Show
//           </h1>
//         </div>
//         <div className="bg-gray-950">
//           <Swiper
//             pagination={true}
//             navigation={true}
//             modules={[Pagination, Navigation]}
//             slidesPerView={6}
//             spaceBetween={8}
//             className="mySwiper" 
//           >
//             <div className="flex gap-[10px]">
//               {AiringTodayTVShow.slice(0, 9).map((tvshow, index) => {
//                 return (
//                   <div key={tvshow.id}>
//                     <SwiperSlide key={`${tvshow.id}-${index}`}>
//                       <div className="main-cart">
//                         <div className="main-cart-inner w-full rounded-t-lg relative">
//                           <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                             <img src={miniimg} alt="" />
//                           </div>
//                           <div>
//                             <img
//                               src={`${imageBaseUrl}${tvshow.backdrop_path}`}
//                               alt={tvshow.title}
//                               onClick={() => {
//                                 handleGetTrailer(tvshow.id); // Fetches the trailer
//                                 setSelectedTvshow(tvshow); // Sets the selected movie
//                               }}
//                               onMouseEnter={async () => {
//                                 handleGetTrailer(tvshow.id);
//                                 setHoveredMovieId(tvshow.id); // Set hovered movie ID
//                                 try {
//                                   // Dispatch multiple actions one by one or use Promise.all for parallel dispatch
//                                   await dispatch(
//                                     getTvshowDetails(tvshow.id)
//                                   ).unwrap();
//                                   await dispatch(
//                                     getMovieCertifications(tvshow.id)
//                                   ).unwrap(); // .unwrap() is used to handle the promise result or errors
//                                 } catch (error) {
//                                   console.error(
//                                     "Error fetching movie details or certifications:",
//                                     error
//                                   );
//                                 }
//                               }}
//                               onMouseLeave={() => setHoveredMovieId(null)} // Clear on mouse leave
//                               className="cursor-pointer"
//                             />
//                           </div>
//                           <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                             <h1>{tvshow.name}</h1>
//                           </div>
//                         </div>

//                         {/* Conditionally render additional details if this movie is hovered */}

//                         <div className="sub-cart text-white hidden p-4 bg-gray-950 rounded-b-lg">
//                           <div className="flex items-center">
//                             <div className="flex space-x-2 items-center justify-between w-full">
//                               <div className="flex gap-[8px]">
//                                 <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
//                                   <svg
//                                     className="w-4 h-4 text-black"
//                                     viewBox="0 0 24 24"
//                                     fill="currentColor"
//                                   >
//                                     <path d="M8 5v14l11-7z" />
//                                   </svg>
//                                 </button>
//                                 <button className="w-6 h-6 border border-gray-500 rounded-full flex items-center justify-center">
//                                   <span>+</span>
//                                 </button>
//                                 <button className="w-6 h-6 border border-gray-500 rounded-full flex items-center justify-center">
//                                   <span>
//                                     <SlLike className="w-[12px] h-[12px]" />
//                                   </span>
//                                 </button>
//                               </div>
//                               <div>
//                                 <button className="ml-auto flex items-center justify-center text-gray-400">
//                                   <IoMdArrowDropdown className="w-6 h-6" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="mt-[10px]">
//                             <div className="flex items-center justify-between space-x-2 text-[14px]">
//                               <div>
//                                 <span className="px-2 py-0.5 bg-gray-700 rounded">
//                                   {/* {`${certifications} ${ageGroup}`} */}
//                                   {}
//                                 </span>
//                               </div>
//                               <div>
//                                 <span>Season {total_season}</span>
//                                 {/* <span className="flex">{`${hours}h ${minutes}m`}</span> */}
//                               </div>
//                               <div>
//                                 <span className="px-1 border border-gray-500 rounded text-xs">
//                                   HD
//                                 </span>
//                               </div>
//                             </div>

//                             <div className="flex gap-[8px] mt-[10px] text-gray-400">
//                               {handlegenres?.map((item, ind) => (
//                                 <div key={ind}>
//                                   <p className="text-[11px] text-justify text-[#777777]">
//                                     {item.name}
//                                     {ind < 2 && " •"}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </SwiperSlide>
//                   </div>
//                 );
//               })}
//             </div>
//           </Swiper>
//         </div>
//       </div>

//       {/* Popup for selected movie */}
//       {selectedTvshow && popupIsOpen && (
//         <div className="mx-auto rounded">
//           <div className="bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
//             <div className="absolute top-3 right-3 z-10">
//               <button onClick={closePopup}>
//                 <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
//               </button>
//             </div>
//             <div className="relative min-h-[800px]">
//               <div className="h-[480px] shadow-main">
//                 {showTrailer && trailerKey ? (
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
//                     title={selectedTvshow.title}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     sandbox="allow-same-origin allow-scripts"
//                     allowFullScreen
//                   ></iframe>
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-white text-xl">
//                     Trailer Not Available
//                   </div>
//                 )}
//               </div>

//               {/* Movie details and similar movies section */}
//               <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
//                 <h1 className="text-3xl font-bold">{selectedTvshow.title}</h1>
//                 <div className="flex items-center mt-[40px]">
//                   <div className="flex">
//                     <button
//                       onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
//                       className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
//                     >
//                       <span>
//                         <RiPlayLargeFill className="w-[25px] h-[25px]" />
//                       </span>
//                       {showTrailer ? "Stop" : "Play"}
//                     </button>
//                   </div>

//                   <div className="gap-[10px] flex">
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50 items-center justify-center flex ">
//                       <TfiPlus className="w-5 h-5" />
//                     </button>
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
//                       <SlLike className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Additional movie info */}

//                 <div className="mt-[60px] font-NetflixSans flex justify-between">
//                   <div className="w-[60%]">
//                     <div className="flex items-center space-x-4">
//                       <span className="text-[#46d369] font-NetflixSans">
//                         New
//                       </span>
//                       <div className="text-[#bcbcbc] flex gap-[8px] items-center">
//                         {/* <span className="">{year}</span> */}
//                         {/* <span>{`${hours}h ${minutes}m`}</span> */}
//                         <div className="flex items-center justify-center w-[35px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
//                           <span className="text-white text-[14px]">HD</span>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="mt-2 text-[20px]">
//                       Tv show
//                       {/* {selectedTvshow.media_type === "tv"
//                         ? "TV Show"
//                         : selectedTvshow.media_type === "movie"
//                         ? "Movie"
//                         : "Unknown Media Type"}{" "} */}
//                     </p>
//                     <p className="mt-4 text-[16px]">
//                       {selectedTvshow.overview.length > 100
//                         ? `${selectedTvshow.overview.slice(0, 100)}...`
//                         : selectedTvshow.overview}
//                     </p>
//                   </div>

//                   <div className="w-[33%]">
//                     <div className="flex flex-wrap items-center gap-1">
//                       <h2 className="text-white">Cast :</h2>
//                       {selectedTvshowCedites.slice(0, 4).map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < 3 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-1 my-[12px]">
//                       <h2 className="text-white">Genres:</h2>
//                       {handlegenres.map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < 2 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-1 my-[12px]">
//                       <h2 className="text-white">This Tv show is :</h2>
//                       <p className="text-[14px] text-justify text-[#777777]">
//                         {rating}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-4 p-12 pt-0">
//               <div className="mb-[50px] flex justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold">
//                     {selectedTvshow.media_type === "tv"
//                       ? "TV Show"
//                       : selectedTvshow.media_type === "movie"
//                       ? "Similar Movie"
//                       : "Unknown Media Type"}{" "}
//                   </h2>
//                 </div>
//                 <div className="bg-black font-NetflixSans px-[8px] py-[5px] rounded">
//                   <select className="bg-black" name="seasons" id="seasons">
//                     <option value="">Select Season</option>
//                     {numberofseason.map((season) => (
//                       <option key={season.id} value={season.id}>
//                         {season.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="mt-2 space-y-4">
//                 <div className="overflow-y-auto h-[400px]">
//                   {/* {SimilarMovies && SimilarMovies.length > 0 ? (
//                     SimilarMovies.slice(0, 10).map((movie, ind) => {
//                       return (
//                         <div
//                           key={movie.id}
//                           className="flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]"
//                         >
//                           <div className="h-[70px] flex items-center">
//                             <h1 className="text-[24px]">{ind + 1}</h1>
//                           </div>
//                           <div className="flex w-full items-center justify-between gap-[15px]">
//                             <div className="h-[70px] w-[21%]">
//                               <img
//                                 src={`${imageBaseUrl}${movie.backdrop_path}`}
//                                 alt={movie.title}
//                                 className="w-full h-full object-cover rounded-lg"
//                               />
//                             </div>
//                             <div className="w-[75%]">
//                               <div className="flex items-center justify-between">
//                                 <h3 className="text-white font-normal">
//                                   {movie.title}
//                                 </h3>
//                               </div>
//                               <p className="text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
//                                 {movie.overview.length > 124
//                                   ? `${movie.overview.slice(0, 124)}...`
//                                   : movie.overview}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="flex items-center justify-center py-[34px] text-[#d2d2d2]">
//                       No similar movies found.
//                     </div>
//                   )} */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TvshowAiringToday;









// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import miniimg from "../../assets/img/mini-img.png";
// import { Navigation, Pagination } from "swiper/modules";
// import { RiPlayLargeFill } from "react-icons/ri";
// import { TfiPlus } from "react-icons/tfi";
// import { SlLike } from "react-icons/sl";
// import { IoMdClose } from "react-icons/io";
// import { IoPlayCircleOutline } from "react-icons/io5";
// import Preloader from "../Preloader"; // Import Preloader
// import { getAiringTodayTVShow, getTvshowCedites, getTvshowDetails, getTvshowTrailer } from "../Redux/features/Tvshow/TvshowSlice";

// function TvshowAiringToday() {
//   const dispatch = useDispatch();
//   const {
//     AiringTodayTVShow,
//     selectedTvshowCedites,
//     selectedTvshowDetails,
//     trailerKey,
//     status,
//     error,
//   } = useSelector((state) => state.tvshow);
//   const [popupIsOpen, setPopupIsOpen] = useState(false);
//   const [selectedTvshow, setSelectedTvshow] = useState(null);
//   const [showTrailer, setShowTrailer] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoveredMovieId, setHoveredMovieId] = useState(null);

//   useEffect(() => {
//     dispatch(getAiringTodayTVShow());
//   }, [dispatch]);

//   const handleGetTrailer = async (tvshowId) => {
//     try {
//       await dispatch(getTvshowCedites(tvshowId)).unwrap();
//       await dispatch(getTvshowDetails(tvshowId)).unwrap();
//     //   await dispatch(getMovieSimilar(tvshowId)).unwrap();
//       const trailerResult = await dispatch(getTvshowTrailer(tvshowId)).unwrap();

//       if (trailerResult) {
//         setPopupIsOpen(true);
//       } else {
//         console.error("Trailer not available for this movie.");
//       }
//     } catch (error) {
//       console.error("Error fetching movie data:", error);
//     }
//   };

//   // Handle loader and error states
//   // if (status === "loading") {
//   //   return <Preloader />; // Show preloader while loading
//   // }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   let handlegenres = selectedTvshowDetails.genres;
//   // console.log("hendlegenres", handlegenres);

//   const closePopup = () => {
//     setPopupIsOpen(false);
//     setShowTrailer(false);
//     setTimeout(() => setSelectedTvshow(null), 500);
//   };

//   // console.log("AiringTodayTVShow" , AiringTodayTVShow);
//   const year = new Date(selectedTvshowDetails.last_air_date).getFullYear();
// // console.log("year" , year);

// //   console.log("selectedTvshowCedites", selectedTvshowCedites);
// //   console.log("selectedTvshowDetails", selectedTvshowDetails);

//   let total_episodes =  selectedTvshowDetails.number_of_episodes
// //   console.log("total_episodes" , total_episodes);

//   let runtime = selectedTvshowDetails.runtime; // Assuming runtime is a string like "92min"
//   runtime = parseInt(runtime); // Convert string to number

//   let hours = Math.floor(runtime / 60); // Calculate hours
//   let minutes = runtime % 60; // Calculate remaining minutes

//   // console.log(`Runtime: ${hours}h ${minutes}m`);

//   const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Add base URL

//   return (
//     <div className="row overflow-hidden pt-[30px] pb-[400px]">
//       <div className="Trending Today Top 10 movies">
//         <div className="mb-[20px]">
//           <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//             Top 10 Tv show Airing Today
//           </h1>
//         </div>
//         <div>
//           <Swiper
//             pagination={true}
//             navigation={true}
//             modules={[Pagination, Navigation]}
//             slidesPerView={6}
//             spaceBetween={8}
//             className="mySwiper"
//           >
//             <div className="flex gap-[10px]">
//               {AiringTodayTVShow.slice(0, 9).map((tvshow , index) => {
//                 return (
//                   <div key={tvshow.id}>
//                     <SwiperSlide key={`${tvshow.id}-${index}`}>
//                       <div className="main-cart">
//                         <div className="w-full overflow-hidden rounded-[5px] relative">
//                           <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                             <img src={miniimg} alt="" />
//                           </div>
//                           <div>
//                             <img
//                               src={`${imageBaseUrl}${tvshow.backdrop_path}`}
//                               alt={tvshow.title}
//                               onClick={() => {
//                                 handleGetTrailer(tvshow.id); // Fetches the trailer
//                                 setSelectedTvshow(tvshow); // Sets the selected movie
//                               }}
//                               onMouseEnter={async () => {
//                                 setHoveredMovieId(tvshow.id); // Set hovered movie ID
//                                 await dispatch(
//                                   getTvshowDetails(tvshow.id)
//                                 ).unwrap();
//                               }}
//                               onMouseLeave={() => setHoveredMovieId(null)} // Clear on mouse leave
//                               className="cursor-pointer"
//                             />
//                           </div>
//                           <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                             <h1>{tvshow.name}</h1>
//                           </div>
//                         </div>

//                         {/* Conditionally render additional details if this movie is hovered */}
//                         <div
//                           className={`${
//                             hoveredMovieId === tvshow.id ? "block" : "hidden"
//                           } text-white space-x-4 p-4 bg-gray-900 rounded-lg`}
//                         >
//                           <div className="flex items-center">
//                             <div className="flex space-x-2 items-center justify-between">
//                               <div className="flex">
//                                 <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
//                                   <svg
//                                     className="w-4 h-4 text-black"
//                                     viewBox="0 0 24 24"
//                                     fill="currentColor"
//                                   >
//                                     <path d="M8 5v14l11-7z" />
//                                   </svg>
//                                 </button>
//                                 <button className="w-8 h-8 border border-gray-500 rounded-full flex items-center justify-center">
//                                   <span>+</span>
//                                 </button>
//                                 <button className="w-8 h-8 border border-gray-500 rounded-full flex items-center justify-center">
//                                   <span>👍</span>
//                                 </button>
//                               </div>
//                               <div>
//                                 <button className="ml-auto flex items-center justify-center w-8 h-8 text-gray-400">
//                                   <span>▼</span>
//                                 </button>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="space-y-1">
//                             <div className="flex items-center space-x-2">
//                               <span className="px-2 py-0.5 bg-gray-700 text-xs rounded">
//                                 U/A 13+
//                               </span>
//                               <span className="flex">{`${hours}h ${minutes}m`}</span>
//                               <span className="px-1 border border-gray-500 rounded text-xs">
//                                 HD
//                               </span>
//                             </div>

//                             <div className="flex gap-[8px] text-sm text-gray-400">
//                               {handlegenres?.map((item, ind) => (
//                                 <div key={ind}>
//                                   <p className="text-[14px] text-justify text-[#777777]">
//                                     {item.name}
//                                     {ind < 2 && " •"}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </SwiperSlide>
//                   </div>
//                 );
//               })}
//             </div>
//           </Swiper>
//         </div>
//       </div>

//       {/* Popup for selected movie */}
//       {selectedTvshow && popupIsOpen && (
//         <div className="mx-auto rounded">
//           <div className="bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
//             <div className="absolute top-3 right-3 z-10">
//               <button onClick={closePopup}>
//                 <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
//               </button>
//             </div>
//             <div className="relative min-h-[800px]">
//               <div className="h-[480px] shadow-main">
//                 {showTrailer ? (
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
//                     title={selectedTvshow.title}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     sandbox="allow-same-origin allow-scripts"
//                     allowFullScreen
//                   ></iframe>
//                 ) : (
//                   <img
//                     src={`${imageBaseUrl}${selectedTvshow.backdrop_path}`}
//                     alt={selectedTvshow.title}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>

//               {/* Movie details and similar movies section */}
//               <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
//                 <h1 className="text-3xl font-bold">{selectedTvshow.title}</h1>
//                 <div className="flex items-center mt-[40px]">
//                   <div className="flex">
//                     <button
//                       onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
//                       className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
//                     >
//                       <span>
//                         <RiPlayLargeFill className="w-[25px] h-[25px]" />
//                       </span>
//                       {showTrailer ? "Stop" : "Play"}
//                     </button>
//                   </div>

//                   <div className="gap-[10px] flex">
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50 items-center justify-center flex ">
//                       <TfiPlus className="w-5 h-5" />
//                     </button>
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
//                       <SlLike className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Additional movie info */}

//                 <div className="mt-[60px] flex justify-between">
//                   <div className="w-[60%]">
//                     <div className="flex items-center space-x-4">
//                       <span className="text-[#46d369] font-NetflixSans">
//                         New
//                       </span>
//                       <div className="text-[#bcbcbc] flex gap-[8px] items-center">
//                         <span>{selectedTvshowDetails.number_of_seasons} Seasons</span>
//                         <span className="">{year}</span>
//                         <div className="flex items-center justify-center w-[40px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
//                           <span className="text-white text-[14px]">HD</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center p-2 rounded-md">
//                       <div className="px-[4px] border-[1px] border-[#808080] text-[#808080] text-[11px] mr-2">
//                         TV-MA
//                       </div>
//                       <div className="text-white flex text-[14px]">
//                         {handlegenres.map((item, ind) => {
//                           return (
//                             <div key={ind}>
//                               <p className="text-[14px] text-justify text-[#777777]">
//                                 {item.name}
//                                 {ind < 2 && ","}
//                               </p>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                     <p className="mt-2 text-[20px]">
//                       {selectedTvshow.media_type === "tv"
//                         ? "TV Show"
//                         : selectedTvshow.media_type === "movie"
//                         ? "Movie"
//                         : "Unknown Media Type"}{" "}
//                     </p>
//                     <p className="mt-4 text-[16px]">
//                       {selectedTvshow.overview.length > 160
//                         ? `${selectedTvshow.overview.slice(0, 160)}...`
//                         : selectedTvshow.overview}
//                     </p>
//                   </div>

//                   <div className="w-[33%]">
//                     <div className="flex flex-wrap items-center gap-1">
//                       <h2 className="text-white">Cast :</h2>
//                       {selectedTvshowCedites.slice(0, 4).map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < 3 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-1 my-[12px]">
//                       <h2 className="text-white">Genres:</h2>
//                       {handlegenres.map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < 2 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-4 p-12 pt-0">
//               <div className="mb-[50px]">
//                 <h2 className="text-2xl font-bold">
//                   {selectedTvshow.media_type === "tv"
//                     ? "TV Show"
//                     : selectedTvshow.media_type === "movie"
//                     ? "Similar Movie"
//                     : "Unknown Media Type"}{" "}
//                 </h2>
//               </div>
//               <div className="mt-2 space-y-4">
//                 <div className="overflow-y-auto h-[400px]">
//                   {SimilarMovies.slice(0, 10).map((movie, ind) => {
//                     return (
//                       <div className="flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]">
//                         <div className="h-[70px] flex items-center">
//                           <h1 className="text-[24px]">{ind + 1}</h1>
//                         </div>
//                         <div className="flex w-full items-center justify-between gap-[15px]">
//                           <div className="h-[70px] w-[21%]">
//                             <img
//                               src={`${imageBaseUrl}${movie.backdrop_path}`}
//                               alt={movie.title}
//                               className="w-full h-full object-cover rounded-lg"
//                             />
//                           </div>
//                           <div className="w-[75%]">
//                             <div className="flex items-center justify-between">
//                               <h3 className="text-white font-normal">
//                                 {movie.title}
//                               </h3>
//                             </div>
//                             <p className="text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
//                               {movie.overview.length > 124
//                                 ? `${movie.overview.slice(0, 124)}...`
//                                 : movie.overview}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TvshowAiringToday;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getMovieCedites,
//   getMovieDetails,
//   getMovieSimilar,
//   getMovieTrailer,
//   getPopularMovies,
//   getTrendingMovies,
//   getTrendingTodayMovies,
//   getTrendingTvshow,
// } from "./Redux/features/movies/movieSlice";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import miniimg from "../assets/img/mini-img.png";
// import { Pagination } from "swiper/modules";
// import { RiPlayLargeFill } from "react-icons/ri";
// import { TfiPlus } from "react-icons/tfi";
// import { SlLike } from "react-icons/sl";
// import { IoMdClose } from "react-icons/io";
// import { IoPlayCircleOutline } from "react-icons/io5";
// function Row() {
//   const dispatch = useDispatch();
//   const {
//     trending,
//     popular,
//     tvshow,
//     selectedMovieCedites,
//     selectedMovieDetails,
//     SimilarMovies,
//     todaytrending,
//     trailerKey,
//     status,
//     error,
//   } = useSelector((state) => state.movies);
//   const [popupIsOpen, setPopupIsOpen] = useState(false);
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [showTrailer, setShowTrailer] = useState(false);

//   useEffect(() => {
//     dispatch(getTrendingMovies());
//     dispatch(getPopularMovies());
//     dispatch(getTrendingTvshow());
//     dispatch(getTrendingTodayMovies());
//   }, [dispatch]);

//   console.log("trending mian", trending);
//   console.log("popular mian", popular);
//   console.log("tvshow mian", tvshow);

//   const handleGetTrailer = async (movieId) => {
//     try {
//       await dispatch(getMovieCedites(movieId)).unwrap();
//       await dispatch(getMovieDetails(movieId)).unwrap();
//       await dispatch(getMovieSimilar(movieId)).unwrap();
//       const trailerResult = await dispatch(getMovieTrailer(movieId)).unwrap();

//       if (trailerResult) {
//         setPopupIsOpen(true);
//       } else {
//         console.error("Trailer not available for this movie.");
//       }
//     } catch (error) {
//       console.error("Error fetching movie data:", error);
//     }
//   };

//   console.log("selectedMovieCedite", selectedMovieCedites);
//   console.log("selectedMovieDetails", selectedMovieDetails);

//   console.log("SimilarMovies", SimilarMovies);

//   let handlegenres = selectedMovieDetails.genres;
//   console.log("hendlegenres", handlegenres);

// let runtime = selectedMovieDetails.runtime; // Assuming runtime is a string like "92min"
// runtime = parseInt(runtime); // Convert string to number

// let hours = Math.floor(runtime / 60); // Calculate hours
// let minutes = runtime % 60; // Calculate remaining minutes

// console.log(`Runtime: ${hours}h ${minutes}m`);

//   if (status === "loading") {
//     return <p>Loading movies...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   const closePopup = () => {
//     setPopupIsOpen(false);
//     setShowTrailer(false);
//   };

//   const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Add base URL

//   return (
//     <div className="row">
//       <div className="Trending Today Top 10 movies">
//         <div className="mb-[20px]">
//           <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//             Today Top 10 movies
//           </h1>
//         </div>
//         <Swiper
//           pagination={true}
//           modules={[Pagination]}
//           slidesPerView={3}
//           spaceBetween={8}
//           className="mySwiper"
//         >
//           <div className="flex gap-[10px]">
//             {todaytrending.map((movie) => (
//               <SwiperSlide key={movie.id}>
//                 <div className="w-[250px] overflow-hidden rounded-[5px]">
//                   <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                     <img src={miniimg} alt="" />
//                   </div>
//                   <div>
//                     <img
//                       src={`${imageBaseUrl}${movie.backdrop_path}`}
//                       alt={movie.title}
//                       onClick={() => {
//                         handleGetTrailer(movie.id); // Fetches the trailer
//                         setSelectedMovie(movie); // Sets the selected movie
//                       }}
//                       className="cursor-pointer"
//                     />
//                   </div>
//                   <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                     <h1>{movie.title}</h1>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </div>
//         </Swiper>
//       </div>

//       {selectedMovie && popupIsOpen && (
//         <div className="mx-auto rounded">
//           <div className="bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
//             <div className="absolute top-3 right-3 z-10">
//               <button onClick={closePopup}>
//                 <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
//               </button>
//             </div>
//             <div className="relative min-h-[800px]">
//               <div className="h-[480px] shadow-main">
//                 {showTrailer ? (
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
//                     title={selectedMovie.title}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     sandbox="allow-same-origin allow-scripts"
//                     allowFullScreen
//                   ></iframe>
//                 ) : (
//                   <img
//                     src={`${imageBaseUrl}${selectedMovie.backdrop_path}`}
//                     alt={selectedMovie.title}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>

//               <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
//                 <h1 className="text-3xl font-bold">{selectedMovie.title}</h1>

//                 <div className="flex items-center mt-[40px]">
//                   <div className="flex">
//                     <button
//                       onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
//                       className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
//                     >
//                       <span>
//                         <RiPlayLargeFill className="w-[25px] h-[25px]" />
//                       </span>
//                       {showTrailer ? "Stop" : "Play"}{" "}
//                     </button>
//                   </div>

//                   <div className="gap-[10px] flex">
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50 items-center justify-center flex ">
//                       <TfiPlus className="w-5 h-5" />
//                     </button>
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
//                       <SlLike className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-[60px] flex justify-between">
//                   <div className="w-[60%]">
//                     <div className="flex items-center space-x-4">
//                       <span className="text-[#46d369] font-NetflixSans">
//                         New
//                       </span>
//                       <div className="text-[#bcbcbc] flex gap-[8px] items-center">
//                         <span>3 Seasons</span>
//                         <span className="">2024</span>
//                         <div className="flex items-center justify-center w-[40px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
//                           <span className="text-white text-[14px]">HD</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center p-2 rounded-md">
//                       <div className="px-[4px] border-[1px] border-[#808080] text-[#808080] text-[11px] mr-2">
//                         TV-MA
//                       </div>
//                       <div className="text-white flex text-[14px]">
//                         {handlegenres.map((item, ind) => {
//                           return (
//                             <div key={ind}>
//                               <p className="text-[14px] text-justify text-[#777777]">
//                                 {item.name}
//                                 {ind < 2 && ","}
//                               </p>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                     <p className="mt-2 text-[20px]">
//                       {selectedMovie.media_type === "tv"
//                         ? "TV Show"
//                         : selectedMovie.media_type === "movie"
//                         ? "Movie"
//                         : "Unknown Media Type"}{" "}
//                     </p>
//                     <p className="mt-4 text-[16px]">
//                       {selectedMovie.overview.length > 160
//                         ? `${selectedMovie.overview.slice(0, 160)}...`
//                         : selectedMovie.overview}
//                     </p>
//                   </div>

//                   <div className="w-[33%]">
//                     <div className="flex flex-wrap items-center gap-1">
//                       <h2 className="text-white">Cast :</h2>
//                       {selectedMovieCedites.slice(0, 4).map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < 3 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-1 my-[12px]">
//                       <h2 className="text-white">Genres:</h2>
//                       {handlegenres.map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < 2 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

// <div className="mt-4 p-12 pt-0">
//   <div className="mb-[50px]">
//     <h2 className="text-2xl font-bold">
//       {selectedMovie.media_type === "tv"
//         ? "TV Show"
//         : selectedMovie.media_type === "movie"
//         ? "Similar Movie"
//         : "Unknown Media Type"}{" "}
//     </h2>
//   </div>
//   <div className="mt-2 space-y-4">
//     <div className="overflow-y-auto h-[400px]">
//       {SimilarMovies.slice(0, 10).map((movie, ind) => {
//         return (
//           <div className="flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]">
//             <div className="h-[70px] flex items-center">
//               <h1 className="text-[24px]">{ind + 1}</h1>
//             </div>
//             <div className="flex w-full items-center justify-between gap-[15px]">
//               <div className="h-[70px] w-[21%]">
//                 <img
//                   src={`${imageBaseUrl}${movie.backdrop_path}`}
//                   alt={movie.title}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               </div>
//               <div className="w-[75%]">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-white font-normal">
//                     {movie.title}
//                   </h3>
//                 </div>
//                 <p className="text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
//                   {movie.overview.length > 124
//                     ? `${movie.overview.slice(0, 124)}...`
//                     : movie.overview}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Row;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getMovieCedites,
//   getMovieDetails,
//   getMovieSimilar,
//   getMovieTrailer,
//   getPopularMovies,
//   getTrendingMovies,
//   getTrendingTodayMovies,
//   getTrendingTvshow,
// } from "./Redux/features/movies/movieSlice";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import miniimg from "../assets/img/mini-img.png";
// import { Pagination } from "swiper/modules";
// import { RiPlayLargeFill } from "react-icons/ri";
// import { TfiPlus } from "react-icons/tfi";
// import { SlLike } from "react-icons/sl";
// import { IoMdClose } from "react-icons/io";
// function Row() {
//   const dispatch = useDispatch();
//   const {
//     trending,
//     popular,
//     tvshow,
//     selectedMovieCedites,
//     selectedMovieDetails,
//     SimilarMovies,
//     todaytrending,
//     trailerKey,
//     status,
//     error,
//   } = useSelector((state) => state.movies);
//   const [popupIsOpen, setPopupIsOpen] = useState(false);
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [showTrailer, setShowTrailer] = useState(false);

//   useEffect(() => {
//     dispatch(getTrendingMovies());
//     dispatch(getPopularMovies());
//     dispatch(getTrendingTvshow());
//     dispatch(getTrendingTodayMovies());
//   }, [dispatch]);

//   console.log("trending mian", trending);
//   console.log("popular mian", popular);
//   console.log("tvshow mian", tvshow);

//   const handleGetTrailer = async (movieId) => {
//     try {
//       await dispatch(getMovieCedites(movieId)).unwrap();
//       await dispatch(getMovieDetails(movieId)).unwrap();
//       await dispatch(getMovieSimilar(movieId)).unwrap();
//       const trailerResult = await dispatch(getMovieTrailer(movieId)).unwrap();

//       if (trailerResult) {
//         setPopupIsOpen(true);
//       } else {
//         console.error("Trailer not available for this movie.");
//       }
//     } catch (error) {
//       console.error("Error fetching movie data:", error);
//     }
//   };

//   console.log("selectedMovieCedite", selectedMovieCedites);
//   console.log("selectedMovieDetails", selectedMovieDetails);

//   console.log("SimilarMovies", SimilarMovies);

//   let handlegenres = selectedMovieDetails.genres;
//   console.log("hendlegenres", handlegenres);

//   let runtime = selectedMovieDetails.runtime; // Assuming runtime is a string like "92min"
// runtime = parseInt(runtime); // Convert string to number

// let hours = Math.floor(runtime / 60); // Calculate hours
// let minutes = runtime % 60; // Calculate remaining minutes

// console.log(`Runtime: ${hours}h ${minutes}m`);

//   if (status === "loading") {
//     return <p>Loading movies...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   const closePopup = () => {
//     setPopupIsOpen(false);
//     setShowTrailer(false);
//   };

//   const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Add base URL

//   return (
//     <div className="row">
//       <div className="Trending Today Top 10 movies">
//         <div className="mb-[20px]">
//           <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//             Today Top 10 movies
//           </h1>
//         </div>
//         <Swiper
//           pagination={true}
//           modules={[Pagination]}
//           slidesPerView={3}
//           spaceBetween={8}
//           className="mySwiper"
//         >
//           <div className="flex gap-[10px]">
//             {todaytrending.map((movie) => (
//               <SwiperSlide key={movie.id}>
//                 <div className="w-[250px] overflow-hidden rounded-[5px]">
//                   <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                     <img src={miniimg} alt="" />
//                   </div>
//                   <div>
//                     <img
//                       src={`${imageBaseUrl}${movie.backdrop_path}`}
//                       alt={movie.title}
//                       onClick={() => {
//                         handleGetTrailer(movie.id); // Fetches the trailer
//                         setSelectedMovie(movie); // Sets the selected movie
//                       }}
//                       className="cursor-pointer"
//                     />
//                   </div>
//                   <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                     <h1>{movie.title}</h1>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </div>
//         </Swiper>
//       </div>

//       <div className="Trending">
//         <div className="mb-[20px]">
//           <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//             Trending Movies
//           </h1>
//         </div>
//         <Swiper
//           pagination={true}
//           modules={[Pagination]}
//           slidesPerView={3}
//           spaceBetween={8}
//           className="mySwiper"
//         >
//           <div className="flex gap-[10px]">
//             {trending.map((movie) => (
//               <SwiperSlide key={movie.id}>
//                 <div className="w-[250px] overflow-hidden rounded-[5px]">
//                   <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                     <img src={miniimg} alt="" />
//                   </div>
//                   <div>
//                     <img
//                       src={`${imageBaseUrl}${movie.backdrop_path}`}
//                       alt={movie.title}
//                       onClick={() => handleGetTrailer(movie.id)}
//                       className="cursor-pointer"
//                     />
//                   </div>
//                   <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                     <h1>{movie.title}</h1>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </div>
//         </Swiper>
//       </div>

//       <div className="Trending Popular Movies">
//         <div className="mb-[20px]">
//           <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//             Popular Movies
//           </h1>
//         </div>
//         <Swiper
//           pagination={true}
//           modules={[Pagination]}
//           slidesPerView={3}
//           spaceBetween={8}
//           className="mySwiper"
//         >
//           <div className="flex gap-[10px]">
//             {popular.map((movie) => (
//               <SwiperSlide key={movie.id}>
//                 <div className="w-[250px] overflow-hidden rounded-[5px]">
//                   <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                     <img src={miniimg} alt="" />
//                   </div>
//                   <div>
//                     <img
//                       src={`${imageBaseUrl}${movie.backdrop_path}`}
//                       alt={movie.title}
//                       onClick={() => handleGetTrailer(movie.id)}
//                       className="cursor-pointer"
//                     />
//                   </div>
//                   <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                     <h1>{movie.title}</h1>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </div>
//         </Swiper>
//       </div>

//       <div className="Trending TV show">
//         <div className="mb-[20px]">
//           <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
//             TV show
//           </h1>
//         </div>
//         <Swiper
//           pagination={true}
//           modules={[Pagination]}
//           slidesPerView={3}
//           spaceBetween={8}
//           className="mySwiper"
//         >
//           <div className="flex gap-[10px]">
//             {tvshow.map((movie) => (
//               <SwiperSlide key={movie.id}>
//                 <div className="w-[250px] overflow-hidden rounded-[5px]">
//                   <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
//                     <img src={miniimg} alt="" />
//                   </div>
//                   <div>
//                     <img
//                       src={`${imageBaseUrl}${movie.backdrop_path}`}
//                       alt={movie.name}
//                       onClick={() => handleGetTrailer(movie.id)}
//                       className="cursor-pointer"
//                     />
//                   </div>
//                   <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
//                     <h1>{movie.name}</h1>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </div>
//         </Swiper>
//       </div>
//       {selectedMovie && popupIsOpen && (
//         <div className="mx-auto rounded">
//           <div className="bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
//             <div className="absolute top-3 right-3 z-10">
//               <button onClick={closePopup}>
//                 <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
//               </button>
//             </div>
//             <div className="relative min-h-[800px]">
//               <div className="h-[480px] shadow-main">
//                 {showTrailer ? (
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
//                     title={selectedMovie.title}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     sandbox="allow-same-origin allow-scripts"
//                     allowFullScreen
//                   ></iframe>
//                 ) : (
//                   <img
//                     src={`${imageBaseUrl}${selectedMovie.backdrop_path}`}
//                     alt={selectedMovie.title}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>

//               <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
//                 <h1 className="text-3xl font-bold">{selectedMovie.title}</h1>

//                 <div className="flex items-center mt-[40px]">
//                   <div className="flex">
//                     <button
//                       onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
//                       className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
//                     >
//                       <span>
//                         <RiPlayLargeFill className="w-[25px] h-[25px]" />
//                       </span>
//                       {showTrailer ? "Stop" : "Play"}{" "}
//                     </button>
//                   </div>

//                   <div className="gap-[10px] flex">
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50 items-center justify-center flex">
//                       <TfiPlus className="w-5 h-5" />
//                     </button>
//                     <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
//                       <SlLike className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-[60px] flex justify-between">
//                   <div className="w-[60%]">
//                     <div className="flex items-center space-x-4">
//                       <span className="text-[#46d369] font-NetflixSans">
//                         New
//                       </span>
//                       <div className="text-[#bcbcbc] flex gap-[8px] items-center">
//                         <span>3 Seasons</span>
//                         <span className="">2024</span>
//                         <div className="flex items-center justify-center w-[40px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
//                           <span className="text-white text-[14px]">HD</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center p-2 rounded-md">
//                       <div className="px-[4px] border-[1px] border-[#808080] text-[#808080] text-[11px] mr-2">
//                         TV-MA
//                       </div>
//                       <div className="text-white flex text-[14px]">
//                         {handlegenres.map((item, ind) => {
//                           return (
//                             <div key={ind}>
//                               <p className="text-[14px] text-justify text-[#777777]">
//                                 {item.name}
//                                 {ind < selectedMovieCedites.length - 1 && ","}
//                               </p>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                     <p className="mt-2 text-[20px]">
//                       {selectedMovie.media_type === "tv"
//                         ? "TV Show"
//                         : selectedMovie.media_type === "movie"
//                         ? "Movie"
//                         : "Unknown Media Type"}{" "}
//                     </p>
//                     <p className="mt-4 text-[16px]">{selectedMovie.overview}</p>
//                   </div>

//                   <div className="w-[33%]">
//                     <div className="flex flex-wrap items-center gap-1">
//                       <h2 className="text-white">Cast :</h2>
//                       {selectedMovieCedites.slice(0, 4).map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < 3 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-1 my-[12px]">
//                       <h2 className="text-white">Genres:</h2>
//                       {handlegenres.map((item, ind) => {
//                         return (
//                           <div key={ind}>
//                             <p className="text-[14px] text-justify text-[#777777]">
//                               {item.name}
//                               {ind < selectedMovieCedites.length - 1 && ","}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <div>
//                       <p className="text-[14px]">
//                         <span className="text-[#777777]">This show is:</span>{" "}
//                         Dark, Suspenseful, Exiting
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 p-12 pt-0">
//               <div className="mb-[50px]">
//               <h2 className="text-2xl font-bold">
//                 {selectedMovie.media_type === "tv"
//                   ? "TV Show"
//                   : selectedMovie.media_type === "movie"
//                   ? "Similar Movie"
//                   : "Unknown Media Type"}{" "}
//               </h2>
//               </div>
//               <div className="mt-2 space-y-4">
//                 <div className="overflow-y-auto h-[400px]">
//                   {SimilarMovies.slice(0, 10).map((movie, ind) => {
//                     return (
//                       <div className="flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]">
//                         <div className="h-[70px] flex items-center">
//                           <h1 className="text-[24px]">{ind + 1}</h1>
//                         </div>
//                         <div className="flex items-center justify-between gap-[15px]">
//                           <div className="h-[70px] w-[200px]">
//                             <img
//                               src={`${imageBaseUrl}${movie.backdrop_path}`}
//                               alt={movie.title}
//                               className="w-full h-full object-cover rounded-lg"
//                             />
//                           </div>
//                           <div>
//                             <div className="flex items-center justify-between">
//                               <h3 className="text-white font-normal">
//                                 {movie.title}
//                               </h3>
//                               <p className="font-normal">55m</p>
//                             </div>
//                             <p className="text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
//                               {movie.overview.length > 124
//                                 ? `${movie.overview.slice(0, 124)}...`
//                                 : movie.overview}
//                             </p>

//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Row;
