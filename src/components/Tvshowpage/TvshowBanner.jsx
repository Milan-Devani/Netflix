import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Adjusted import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoMdClose, IoMdPlay } from "react-icons/io";
import { RiPlayLargeFill } from "react-icons/ri";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { TfiPlus } from "react-icons/tfi";
import { SlLike } from "react-icons/sl";
import Preloader from "../Preloader";

import {
  getTVShow,
  getTvshowSeason,
  getTvshowCedites,
  getTvshowDetails,
  getTvshowEpisode,
  getTvshowTrailer,
} from "../Redux/features/Tvshow/TvshowSlice";
import { movieaddToWishlist, removeFromWishlist, tvshowaddToWishlist } from "../Redux/features/wishlist/wishlistSlice";
import { FaMinus } from "react-icons/fa";

const TvshowBanner = () => {
  const dispatch = useDispatch();
  const {
    trailerKey,
    getTvshow,
    selectedTvshowCedites,
    selectedTvshowDetails,
    TvshowEpisode,
    selectedTvshowseasonep,
    status,
    error,
  } = useSelector((state) => state.tvshow);

  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTvshow, setselectedTvshow] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedSeasonId, setSelectedSeasonId] = useState(null); // Track selected season ID
  const wishlistitem = useSelector((state) => state.wishlistitem.items);


  useEffect(() => {
    dispatch(getTVShow());

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  let youtubeTrailer = trailerKey;

  const handleEpisodeClick = (episode, tvshowid) => {
    setIsLoading(true);
    handleGetTrailer(tvshowid);
    setselectedTvshow(episode);
    console.log("Episode:", episode);
  };

  const isInWishlist = wishlistitem.some((item) => item.id === selectedTvshow?.id);

  const handleWishlist = (tvshow) => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(tvshow)); // Remove from wishlist
    } else {
      dispatch(movieaddToWishlist(tvshow)); // Add to wishlist
    }
  };

  if (isLoading === true) {
    return (
      <div className="main-preloader">
        <Preloader />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="main-preloader">
        <Preloader />
      </div>
    );
  }

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
        // await dispatch(getMovieCertifications(tvshowId)).unwrap();
        return await dispatch(getTvshowTrailer(tvshowId)).unwrap();
      })();

      const trailerResult = await Promise.all([
        preloaderPromise,
        dataFetchPromise,
      ]).then(([, trailerResult]) => trailerResult);

      setIsLoading(false);

      if (trailerResult) {
        setIsLoading(true);
        setPopupIsOpen(true);
      } else {
        setIsLoading(true);
        console.error("Trailer not available for this tvshow.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tvshow data:", error);
      setIsLoading(false);
    }
  };
  const closePopup = () => {
    setPopupIsOpen(false);
    setShowTrailer(false);
  };

  const handleSeasonSelect = (seasonId, seasonNumber) => {
    console.log(
      "Dispatching with Season ID:",
      seasonId,
      "Season Number:",
      seasonNumber
    );
    dispatch(getTvshowSeason({ seasonId, seasonNumber }));
  };

  let tvshowseasonid = selectedTvshowDetails.id;
  console.log("tvshowseasonid", tvshowseasonid);

  let voteAverage = selectedTvshowDetails.vote_average;
  console.log("voteAverage", voteAverage);

  console.log("selectedTvshowDetails", selectedTvshow);

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

  let Tvshowseasonepisodes = selectedTvshowseasonep.episodes;

  const totalepisodes = selectedTvshowDetails.number_of_episodes;
  let seasonname = selectedTvshowDetails.seasons;

  let currentepisodesnumber = selectedTvshow?.episode_number;
  let currentseasonsnumber = selectedTvshow?.season_number;

  const handleSeasonChange = async (e) => {
    const seasonId = e.target.value;
    setSelectedSeasonId(seasonId);
    // Fetch episodes for the selected season
    try {
      await dispatch(
        getTvshowDetails({ tvshowId: selectedTvshow.id, seasonId })
      ).unwrap();
    } catch (error) {
      console.error("Error fetching episodes for selected season:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading Tvshow...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const lastAirDate = new Date(selectedTvshowDetails.last_air_date);
  const year = lastAirDate.getFullYear();
  // console.log("Year of last air date:", year);

  let totalseasons = selectedTvshowDetails.number_of_seasons;
  let season = selectedTvshowDetails.seasons;
  let handlegenres = selectedTvshowDetails.genres;
  // console.log("hendlegenres", handlegenres);

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

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div>
      <div className="banner">

        

<div className="movie-container relative top-[-80px] web-banner-view">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          speed={1000}
          navigation
          pagination={{ clickable: true }}
          className="movie-swiper"
        >
          {getTvshow?.filter((tvshow) => tvshow.backdrop_path)
            .slice(0, 9)
            .map((tvshow, ind) => (
              <SwiperSlide key={tvshow.id}>
                <div className="relative h-screen items-center">
                  <div className="h-[754px] ">
                    <img
                      src={`https://image.tmdb.org/t/p/w1280${tvshow.backdrop_path}`}
                      alt={tvshow.original_name}
                      className="object-cover w-[100%] h-[100%]"
                    />
                  </div>

                  <div className="mobile-banner-view hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/original${tvshow.poster_path}`}
                      alt={tvshow.original_name}
                      className="object-cover w-[100%] h-[100%]"
                    />
                  </div>

                  <div
                    className="banner-main absolute justify-center
                   inset-0 bg-gradient-to-t from-black to-transparent flex flex-col p-8 px-24"
                  >
                    <div className="banner-main-sub w-[60%]">
                      <h2 className="text-white text-[3.2vw] font-HelveticaNeue font-bold">
                        {tvshow.original_name}
                      </h2>
                      <p className="text-white font-NetflixSans font-light mt-4 max-w-[33rem] leading-[21.71px] text-[1.12vw]">
                        {tvshow.overview.length > 160
                          ? `${tvshow.overview.slice(0, 160)}...`
                          : tvshow.overview}
                      </p>
                      <div className="mt-4 flex">
                        <button
                          className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
                          onClick={() => {
                            handleGetTrailer(tvshow.id); // Fetches the trailer
                            setselectedTvshow(tvshow); // Sets the selected movie
                          }}
                        >
                          <span>
                            <RiPlayLargeFill className="w-[25px] h-[25px]" />
                          </span>
                          Play
                        </button>
                        <button
                           onClick={() => {
                            handleGetTrailer(tvshow.id); // Fetches the trailer
                            setselectedTvshow(tvshow); // Sets the selected movie
                          }}
                          className="bg-[#6d6d6e]/70 flex text-[1.045vw] text-white px-4 gap-[10px] py-2 rounded font-NetflixSans font-bold"
                        >
                          <span>
                            <AiOutlineInfoCircle className="w-[25px] h-[25px]" />
                          </span>
                          More Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <div className="movie-container relative top-[-80px] mobile-banner-view hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          speed={1000}
          navigation
          pagination={{ clickable: true }}
          className="movie-swiper"
        >
          {getTvshow?.filter((tvshow) => tvshow.backdrop_path)
            .slice(0, 9)
            .map((tvshow, ind) => (
              <SwiperSlide key={tvshow.id}>
                <div className="relative h-screen items-center">
                  <div className="">
                    <img
                      src={`https://image.tmdb.org/t/p/original${tvshow.poster_path}`}
                      alt={tvshow.original_name}
                      className="w-[100%] h-[100%]"
                    />
                  </div>

                  <div
                    className="banner-main absolute justify-center
                   flex flex-col p-8 px-24"
                  >
                    <div className="banner-main-sub w-[60%]">
                      <h2 className="text-white text-[3.2vw] font-HelveticaNeue font-bold">
                        {tvshow.original_name}
                      </h2>
                      <div className="mobile-banner-view-btn-seation mt-4 flex">
                        <button
                          className="mobile-banner-view-btn bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
                          onClick={() => {
                            handleGetTrailer(tvshow.id); // Fetches the trailer
                            setselectedTvshow(tvshow); // Sets the selected movie
                          }}
                        >
                          <span>
                            <RiPlayLargeFill className="w-[25px] h-[25px]" />
                          </span>
                          Play
                        </button>
                        <button
                           onClick={() => {
                            handleGetTrailer(tvshow.id); // Fetches the trailer
                            setselectedTvshow(tvshow); // Sets the selected movie
                          }}
                          className="bg-[#6d6d6e]/70 flex text-[1.045vw] text-white px-4 gap-[10px] py-2 rounded font-NetflixSans font-bold"
                        >
                          <span>
                            <AiOutlineInfoCircle className="w-[25px] h-[25px]" />
                          </span>
                          More Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

        {/* -=-=- */}

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

                      <button className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
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
                          {selectedTvshowCedites
                            .slice(0, 4)
                            .map((item, ind) => {
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
                            className="cursor-pointer selectedMovie-Similar-row flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]"
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
    </div>
  );
};

export default TvshowBanner;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getTrendingMovies,
//   getMovieTrailer,
//   getMovieDetails,
//   getMovieCedites,
//   getMovieSimilar,
// } from "../Redux/features/movies/movieSlice";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules"; // Adjusted import
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { IoMdClose, IoMdPlay } from "react-icons/io";
// import { RiPlayLargeFill } from "react-icons/ri";
// import { AiOutlineInfoCircle } from "react-icons/ai";
// import { TfiPlus } from "react-icons/tfi";
// import { SlLike } from "react-icons/sl";
// import {
//   getTVShow,
//   getTvshowCedites,
//   getTvshowDetails,
//   getTvshowEpisode,
//   getTvshowTrailer,
// } from "../Redux/features/Tvshow/TvshowSlice";

// const TvshowBanner = () => {
//   const dispatch = useDispatch();
//   const {
//     getTvshow,
//     selectedTvshowCedites,
//     selectedTvshowDetails,
//     TvshowEpisode,
//     status,
//     error,
//   } = useSelector((state) => state.tvshow);

//   const [popupIsOpen, setPopupIsOpen] = useState(false);
//   const [selectedTvshow, setselectedTvshow] = useState(null);
//   const [showTrailer, setShowTrailer] = useState(false);

//   useEffect(() => {
//     dispatch(getTVShow());
//   }, [dispatch]);

//   console.log("tvshow", getTvshow);

//   console.log("TvshowEpisode:", TvshowEpisode);

//   const handleGetTrailer = async (tvshowId) => {
//     try {
//       await dispatch(getTvshowCedites(tvshowId)).unwrap();
//       await dispatch(getTvshowDetails(tvshowId)).unwrap();
//       await dispatch(getTvshowEpisode(tvshowId)).unwrap();
//       const trailerResult = await dispatch(getTvshowTrailer(tvshowId)).unwrap();

//       if (trailerResult) {
//         setPopupIsOpen(true);
//       } else {
//         console.error("Trailer not available for this Tvshow.");
//       }
//     } catch (error) {
//       console.error("Error fetching tvshow data:", error);
//     }
//   };

//   // console.log("TvshowEpisode", TvshowEpisode);

//   // console.log("selectedTvshowDetails", selectedTvshowDetails);
//   // console.log("selectedTvshowDetails seasons", selectedTvshowDetails.seasons);
//   // console.log("selectedTvshowDetails episodes", selectedTvshowDetails.episodes);
//   let CBFC = selectedTvshowDetails.adult;
//   // console.log("selectedTvshowDetails adult", selectedTvshowDetails.adult);

//   // const seasonIds = selectedTvshowDetails?.seasons?.map(season => season.id) || [];
//   // console.log("seasonIds",seasonIds);

//   const lastAirDate = new Date(selectedTvshowDetails.last_air_date);
//   const year = lastAirDate.getFullYear();
//   console.log("Year of last air date:", year);

// let totalseasons = selectedTvshowDetails.number_of_seasons;
// let season = selectedTvshowDetails.seasons;
// let handlegenres = selectedTvshowDetails.genres;
// console.log("hendlegenres", handlegenres);

//   const closePopup = () => {
//     setPopupIsOpen(false);
//     setShowTrailer(false);
//   };

//   if (status === "loading") {
//     return <p>Loading Tvshow...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

//   return (
//     <div>
//       <div className="banner">
// <div className="movie-container relative top-[-80px]">
//   <Swiper
//     modules={[Navigation, Pagination, Autoplay]}
//     loop={true}
//     autoplay={{ delay: 10000, disableOnInteraction: false }}
//     speed={1000}
//     navigation
//     pagination={{ clickable: true }}
//     className="movie-swiper"
//   >
//     {getTvshow.map((tvshow, ind) => (
//       <SwiperSlide key={tvshow.id}>
//         <div className="relative h-screen items-center">
//           <div className="">
//             <img
//               src={`https://image.tmdb.org/t/p/w1280${tvshow.backdrop_path}`}
//               alt={tvshow.original_name}
//               className="object-cover w-full h-full"
//             />
//           </div>
//           <div
//             className="absolute justify-center
//            inset-0 bg-gradient-to-t from-black to-transparent flex flex-col p-8"
//           >
//             <h2 className="text-white text-[3.2vw] font-HelveticaNeue font-bold">
//               {tvshow.original_name}
//             </h2>
//             <p className="text-white font-NetflixSans font-light mt-4 max-w-[33rem] leading-[21.71px] text-[1.12vw]">
//               {tvshow.overview.length > 160
//                 ? `${tvshow.overview.slice(0, 160)}...`
//                 : tvshow.overview}
//             </p>
//             <div className="mt-4 flex">
//               <button
//                 className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
//                 onClick={() => {
//                   handleGetTrailer(tvshow.id); // Fetches the trailer
//                   setselectedTvshow(tvshow); // Sets the selected movie
//                 }}
//               >
//                 <span>
//                   <RiPlayLargeFill className="w-[25px] h-[25px]" />
//                 </span>
//                 Play
//               </button>
//               <button className="bg-[#6d6d6e]/70 flex text-[1.045vw] text-white px-4 gap-[10px] py-2 rounded font-NetflixSans font-bold">
//                 <span>
//                   <AiOutlineInfoCircle className="w-[25px] h-[25px]" />
//                 </span>
//                 More Info
//               </button>
//             </div>
//           </div>
//         </div>
//       </SwiperSlide>
//     ))}
//   </Swiper>
// </div>

//         {selectedTvshow && popupIsOpen && (
//           <div className="mx-auto rounded">
//             <div className="bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
//               <div className="absolute top-3 right-3 z-10">
//                 <button onClick={closePopup}>
//                   <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
//                 </button>
//               </div>
//               <div className="relative min-h-[800px]">
//   <div className="h-[480px] shadow-main">
//     {showTrailer ? (
//       <iframe
//         width="100%"
//         height="100%"
//         src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
//         title={selectedTvshow.title}
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         sandbox="allow-same-origin allow-scripts"
//         allowFullScreen
//       ></iframe>
//     ) : (
//       <img
//         src={`${imageBaseUrl}${selectedTvshow.backdrop_path}`}
//         alt={selectedTvshow.title}
//         className="w-full h-full object-cover"
//       />
//     )}
//   </div>

//   <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
//     <h1 className="text-3xl font-bold">{selectedTvshow.title}</h1>

//     <div className="flex items-center mt-[40px]">
//       <div className="flex">
//         <button
//           onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
//           className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
//         >
//           <span>
//             <RiPlayLargeFill className="w-[25px] h-[25px]" />
//           </span>
//           {showTrailer ? "Stop" : "Play"}{" "}
//         </button>
//       </div>

//       <div className="gap-[10px] flex">
//         <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50 items-center justify-center flex ">
//           <TfiPlus className="w-5 h-5" />
//         </button>
//         <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
//           <SlLike className="w-4 h-4" />
//         </button>
//       </div>
//     </div>

//     <div className="mt-[60px] flex justify-between">
//       <div className="w-[60%]">
//         <div className="flex items-center space-x-4">
//           <span
//             className={`font-NetflixSans ${
//               year > 2024 ? "text-[#46d369]" : "text-[#ff9800]"
//             }`}
//           >
//             {year > 2024 ? "New" : "Old Blockbuster"}
//           </span>
//           <div className="text-[#bcbcbc] flex gap-[8px] items-center">
//             <span>{totalseasons} Seasons</span>
//             <span>{year}</span>
//             <div className="flex items-center justify-center w-[40px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
//               <span className="text-white text-[14px]">HD</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center p-2 rounded-md">
//           <div className="px-[4px] border-[1px] border-[#808080] text-[#808080] text-[11px] mr-2">
//             {selectedTvshowDetails.adult ? "13+" : "18+"}
//           </div>

//           <div className="text-white flex text-[14px]">
//             {handlegenres.map((item, ind) => {
//               return (
//                 <div key={ind}>
//                   <p className="text-[14px] text-justify text-[#777777]">
//                     {item.name}
//                     {ind < 2 && ","}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <p className="mt-2 text-[20px]">TV Show</p>
//         <p className="mt-4 text-[16px]">
//           {selectedTvshow.overview.length > 160
//             ? `${selectedTvshow.overview.slice(0, 160)}...`
//             : selectedTvshow.overview}
//         </p>
//       </div>

//       <div className="w-[33%]">
//         <div className="flex flex-wrap items-center gap-1">
//           <h2 className="text-white">Cast :</h2>
//           {selectedTvshowCedites.slice(0, 4).map((item, ind) => {
//             return (
//               <div key={ind}>
//                 <p className="text-[14px] text-justify text-[#777777]">
//                   {item.name}
//                   {ind < 3 && ","}
//                 </p>
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex flex-wrap items-center gap-1 my-[12px]">
//           <h2 className="text-white">Genres:</h2>
//           {handlegenres.map((item, ind) => {
//             return (
//               <div key={ind}>
//                 <p className="text-[14px] text-justify text-[#777777]">
//                   {item.name}
//                   {ind < 2 && ","}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//               <div className="mt-4 p-12 pt-0">
//                 <div className="mb-[50px] flex justify-between items-center">
//                   <h2 className="text-2xl font-bold">Episodes</h2>
//                   <div className="bg-transparent">
//                     <select
//                       className="bg-transparent text-white border border-gray-300 p-2 rounded"
//                       name="season"
//                       id="season-dropdown"
//                     >
//                       {season.map((seasonItem, ind) => (
//                         <option
//                           key={ind}
//                           value={seasonItem.id}
//                           className="bg-black text-white"
//                         >
//                           {seasonItem.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mt-2 space-y-4">
//                   <div className="overflow-y-auto h-[400px]">
//                     {Array.isArray(TvshowEpisode) &&
//                       TvshowEpisode.slice(0, 10).map((movie, ind) => {
//                         return (
//                           <div className="flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]">
//                             <div className="h-[70px] flex items-center">
//                               <h1 className="text-[24px]">{ind + 1}</h1>
//                             </div>
//                             <div className="flex w-full items-center justify-between gap-[15px]">
//                               <div className="h-[70px] w-[21%]">
//                                 <img
//                                   src={`${imageBaseUrl}${movie.backdrop_path}`}
//                                   alt={movie.title}
//                                   className="w-full h-full object-cover rounded-lg"
//                                 />
//                               </div>
//                               <div className="w-[75%]">
//                                 <div className="flex items-center justify-between">
//                                   <h3 className="text-white font-normal">
//                                     {movie.title}
//                                   </h3>
//                                 </div>
//                                 <p className="text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
//                                   {movie.overview.length > 124
//                                     ? `${movie.overview.slice(0, 124)}...`
//                                     : movie.overview}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TvshowBanner;
