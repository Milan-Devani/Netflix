import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMovieCertifications,
  getTrendingTvshow,
} from "../Redux/features/movies/movieSlice";
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
  getPopularTvshow,
  getTvshowCedites,
  getTvshowDetails,
  getTvshowEpisode,
  getTvshowSeason,
  getTvshowTrailer,
} from "../Redux/features/Tvshow/TvshowSlice";
import { movieaddToWishlist, removeFromWishlist, tvshowaddToWishlist } from "../Redux/features/wishlist/wishlistSlice";
import { tvshowaddToFavoritelist } from "../Redux/features/favorite/FavoriteSlice";
import { FaMinus } from "react-icons/fa";

function Populartv() {
  const dispatch = useDispatch();
  const {
    PopularTvshow,
    selectedTvshowCedites,
    selectedTvshowDetails,
    selectedMovieCertifications,
    // SimilarMovies,
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
  const [hoveredMovieId, setHoveredMovieId] = useState(null); // Track hovered movie's ID
  const [timeWindow, setTimeWindow] = useState("2");
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const wishlistitem = useSelector((state) => state.wishlistitem.items);


  useEffect(() => {
    dispatch(getPopularTvshow());

    // handleSeasonSelect()

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

      // Ensure the preloader shows for at least 5 seconds
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
        setPopupIsOpen(true);
      } else {
        console.error("Trailer not available for this tvshow.");
      }
    } catch (error) {
      console.error("Error fetching tvshow data:", error);
      setIsLoading(false);
    }
  };

  // console.log("PopularTvshow", PopularTvshow);

  let youtubeTrailer = trailerKey;

  // console.log("trailerKeyyyyyyyyyyy", youtubeTrailer);

  if (error) {
    return <p>Error: {error}</p>;
  }

  let handlegenres = selectedTvshowDetails.genres;

  // console.log("handlegenres", handlegenres);

  let voteAverage = selectedTvshowDetails.vote_average;
  // console.log("voteAverage", voteAverage);

  // console.log("selectedTvshowDetails", selectedTvshow);

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

  // console.log("selectedTvshowDetails", selectedTvshowDetails);
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

  let runtime = selectedTvshowDetails.runtime; // Assuming runtime is a string like "92min"
  runtime = parseInt(runtime); // Convert string to number

  let hours = Math.floor(runtime / 60); // Calculate hours
  let minutes = runtime % 60;
  // Calculate remaining minutes

  let currentepisodesnumber = selectedTvshow?.episode_number;
  let currentseasonsnumber = selectedTvshow?.season_number;

  // console.log("currentepisodesnumber", currentepisodesnumber);
  // console.log("currentseasonsnumber", currentseasonsnumber);

  // console.log("selectedTvshowseasonep", selectedTvshowseasonep);

  let Tvshowseasonepisodes = selectedTvshowseasonep.episodes;
  // console.log("Tvshowseasonepisodes", Tvshowseasonepisodes);

  const year = new Date(selectedTvshowDetails.first_air_date).getFullYear();
  const showStatus = year === 2024 ? "New" : "Old";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Add base URL\

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
                Popular Tvshow
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
              {PopularTvshow?.filter((tvshow) => tvshow.backdrop_path).map(
                (tvshow, index) => (
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
                              setSelectedTvshow(tvshow); // Sets the selected movie
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
                )
              )}
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
                <h1 className="selectedMovie-details-section-h1 text-3xl font-bold">
                  {selectedTvshow.name}
                </h1>
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
                      className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex"
                    >
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

export default Populartv;
