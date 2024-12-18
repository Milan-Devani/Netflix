import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMovieCedites,
  getMovieCertifications,
  getMovieDetails,
  getMovieSimilar,
  getMovieTrailer,
  getPopularMovies,
  getTrendingMovies,
  getTrendingMoviesandTvshow,
  getTrendingTodayMovies,
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
import Preloader from "../Preloader"; // Import Preloader

function MovieandTvshowTrendingRow() {
  const dispatch = useDispatch();
  const {
    Trendingmovieandtvshow,
    popular,
    tvshow,
    selectedMovieCedites,
    selectedMovieDetails,
    selectedMovieCertifications,
    SimilarMovies,
    todaytrending,
    trailerKey,
    status,
    error,
  } = useSelector((state) => state.movies);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMovieId, setHoveredMovieId] = useState(null); // Track hovered movie's ID
  const wishlistitem = useSelector((state) => state.wishlistitem.items);
  

  useEffect(() => {
    dispatch(getTrendingMoviesandTvshow());
    dispatch(getPopularMovies());
    dispatch(getTrendingTvshow());
    dispatch(getTrendingTodayMovies());
  }, [dispatch]);

  const handleGetTrailer = async (movieId) => {
    try {
      await dispatch(getMovieCedites(movieId)).unwrap();
      await dispatch(getMovieDetails(movieId)).unwrap();
      await dispatch(getMovieSimilar(movieId)).unwrap();
      await dispatch(getMovieCertifications(movieId)).unwrap();
      const trailerResult = await dispatch(getMovieTrailer(movieId)).unwrap();

      if (trailerResult) {
        setPopupIsOpen(true);
      } else {
        console.error("Trailer not available for this movie.");
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };



  if (error) {
    return <p>Error: {error}</p>;
  }

  console.log("Trendingmovieandtvshow" , Trendingmovieandtvshow); 
  
  let checkmediatype = selectedMovieDetails.media_type

  console.log("checkmediatype" , checkmediatype);
  


  let handlegenres = selectedMovieDetails.genres;
  // console.log("hendlegenres", handlegenres);

  let voteAverage = selectedMovieDetails.vote_average;
  console.log("voteAverage", voteAverage);

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

  console.log(rating);

  const closePopup = () => {
    setPopupIsOpen(false);
    setShowTrailer(false);
    setTimeout(() => setSelectedMovie(null), 500);
  };


  const certificationAgeMap = {
    G: "6+",
    PG: "13+",
    "PG-13": "13+",
    R: "18+",
    "NC-17": "18+",
    U: "6+",
    "12A": "12+",
    15: "15+",
    18: "18+",
  };

  // Get the certification from your selected data
  let certificationalldata = selectedMovieCertifications[1];
  let certifications = certificationalldata
    ? certificationalldata.certification
    : "PG";

  // Map the certification to age group
  let ageGroup = certificationAgeMap[certifications] || "14+";

  console.log("selectedMovieCedite", selectedMovieCedites);
  console.log("selectedMovieDetails", selectedMovieDetails);
  console.log("certificationalldata", certificationalldata);

  console.log("certifications", certifications);

  console.log("SimilarMovies", SimilarMovies);

  let runtime = selectedMovieDetails.runtime;   // Assuming runtime is a string like "92min"
  runtime = parseInt(runtime); // Convert string to number

  let hours = Math.floor(runtime / 60); // Calculate hours
  let minutes = runtime % 60; // Calculate remaining minutes

  const year = new Date(selectedMovieDetails.release_date).getFullYear();
  // console.log("year", year);

  // console.log(`Runtime: ${hours}h ${minutes}m`);

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // Add base URL

  return (
    <div className="netflix-pages row MovieandTvshowTrendingRow overflow-hidden">
      <div className="Trending-Today h-screen">
        <div className="mb-[20px]">
          <h1 className="text-[#e5e5e5] font-NetflixSans text-[20px] font-medium">
            Today Top 10 Movies & Tv Show
          </h1>
        </div>
        <div className="">
          <Swiper
            pagination={true}
            navigation={true}
            modules={[Pagination, Navigation]}
            slidesPerView={6}
            spaceBetween={8}
            className="mySwiper"
          >
            <div className="flex gap-[10px]">
              {Trendingmovieandtvshow.slice(0, 9).map((movie, index) => {
                return (
                  <div key={movie.id}>
                    <SwiperSlide key={`${movie.id}-${index}`}>
                      <div className="main-cart">
                        <div className="main-cart-inner w-full rounded-t-lg relative">
                          <div className="w-[11px] h-[20px] absolute left-[10px] top-[10px]">
                            <img src={miniimg} alt="" />
                          </div>
                          <div>
                            <img
                              src={`${imageBaseUrl}${movie.backdrop_path}`}
                              alt={movie.title}
                              onClick={() => {
                                handleGetTrailer(movie.id); // Fetches the trailer
                                setSelectedMovie(movie); // Sets the selected movie
                              }}
                              onMouseEnter={async () => {
                                setHoveredMovieId(movie.id); // Set hovered movie ID

                                try {
                                  // Dispatch multiple actions one by one or use Promise.all for parallel dispatch
                                  await dispatch(getMovieDetails(movie.id)).unwrap();
                                  await dispatch(getMovieCertifications(movie.id)).unwrap(); // .unwrap() is used to handle the promise result or errors
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
                          <div className="absolute bottom-[10px] left-[10px] font-NetflixSans text-white">
                          <h1>{movie.title || movie.name}</h1>

                          </div>
                        </div>

                        {/* Conditionally render additional details if this movie is hovered */}

                        <div className="sub-cart text-white hidden p-4 bg-gray-950 rounded-b-lg">
                          <div className="flex items-center">
                            <div className="flex space-x-2 items-center justify-between w-full">
                              <div className="flex gap-[8px]">
                                <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-black"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </button>
                                <button className="w-6 h-6 border border-gray-500 rounded-full flex items-center justify-center">
                                  <span>+</span>
                                </button>
                                <button className="w-6 h-6 border border-gray-500 rounded-full flex items-center justify-center">
                                  <span>
                                    <SlLike className="w-[12px] h-[12px]" />
                                  </span>
                                </button>
                              </div>
                              <div>
                                <button className="ml-auto flex items-center justify-center text-gray-400">
                                  <IoMdArrowDropdown className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-[10px]">
                            <div className="flex items-center justify-between space-x-2 text-[14px]">
                              <div>
                                <span className="px-2 py-0.5 bg-gray-700 rounded">
                                  {`${certifications} ${ageGroup}`}
                                </span>
                              </div>
                              <div>
                                <span className="flex">{`${hours}h ${minutes}m`}</span>
                              </div>
                              <div>
                                <span className="px-1 border border-gray-500 rounded text-xs">
                                  HD
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-[8px] mt-[10px] text-gray-400">
                              {handlegenres?.map((item, ind) => (
                                <div key={ind}>
                                  <p className="text-[11px] text-justify text-[#777777]">
                                    {item.name}
                                    {ind < 2 && " •"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </div>
                );
              })}
            </div>
          </Swiper>
        </div>
      </div>

      {/* Popup for selected movie */}
      {selectedMovie && popupIsOpen && (
        <div className="mx-auto rounded">
          <div className="bg-[#181818] w-[850px] top-[100px] left-1/2 transform -translate-x-1/2 mx-auto text-white font-NetflixSans absolute z-[5] rounded-[10px]">
            <div className="absolute top-3 right-3 z-10">
              <button onClick={closePopup}>
                <IoMdClose className="text-white w-8 h-8 cursor-pointer" />
              </button>
            </div>
            <div className="relative min-h-[800px]">
              <div className="h-[480px] shadow-main">
                {showTrailer ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedMovie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Movie details and similar movies section */}
              <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
                <h1 className="selectedMovie-details-section-h1 text-3xl font-bold">{selectedMovie.title}</h1>
                <div className="flex items-center mt-[40px]">
                  <div className="flex">
                    <button
                      onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
                      className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
                    >
                      <span>
                        <RiPlayLargeFill className="w-[25px] h-[25px]" />
                      </span>
                      {showTrailer ? "Stop" : "Play"}
                    </button>
                  </div>

                  <div className="gap-[10px] flex">
                    <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50 items-center justify-center flex ">
                      <TfiPlus className="w-5 h-5" />
                    </button>
                    <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
                      <SlLike className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Additional movie info */}

                <div className="mt-[60px] flex justify-between">
                  <div className="w-[60%]">
                    <div className="flex items-center space-x-4">
                      <span className="text-[#46d369] font-NetflixSans">
                        New
                      </span>
                      <div className="text-[#bcbcbc] flex gap-[8px] items-center">
                        <span className="">{year}</span>
                        <span>{`${hours}h ${minutes}m`}</span>
                        <div className="flex items-center justify-center w-[35px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
                          <span className="text-white text-[14px]">HD</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-[20px]">
                      {selectedMovie.media_type === "tv"
                        ? "TV Show"
                        : selectedMovie.media_type === "movie"
                        ? "Movie"
                        : "Unknown Media Type"}{" "}
                    </p>
                    <p className="mt-4 text-[16px]">
                      {selectedMovie.overview.length > 100
                        ? `${selectedMovie.overview.slice(0, 100)}...`
                        : selectedMovie.overview}
                    </p>
                  </div>

                  <div className="w-[33%]">
                    <div className="flex flex-wrap items-center gap-1">
                      <h2 className="text-white">Cast :</h2>
                      {selectedMovieCedites.slice(0, 4).map((item, ind) => {
                        return (
                          <div key={ind}>
                            <p className="text-[14px] text-justify text-[#777777]">
                              {item.name}
                              {ind < 3 && ","}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-1 my-[12px]">
                      <h2 className="text-white">Genres:</h2>
                      {handlegenres.map((item, ind) => {
                        return (
                          <div key={ind}>
                            <p className="text-[14px] text-justify text-[#777777]">
                              {item.name}
                              {ind < 2 && ","}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-1 my-[12px]">
                      <h2 className="text-white">This Movie is :</h2>
                      <p className="text-[14px] text-justify text-[#777777]">
                        {rating}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-12 pt-0">
              <div className="mb-[50px]">
                <h2 className="text-2xl font-bold">
                  {selectedMovie.media_type === "tv"
                    ? "TV Show"
                    : selectedMovie.media_type === "movie"
                    ? "Similar Movie"
                    : "Unknown Media Type"}{" "}
                </h2>
              </div>
              <div className="mt-2 space-y-4">
                <div className="overflow-y-auto h-[400px]">
                  {SimilarMovies && SimilarMovies.length > 0 ? (
                    SimilarMovies.slice(0, 10).map((movie, ind) => {
                      return (
                        <div
                          key={movie.id}
                          className="flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]"
                        >
                          <div className="h-[70px] flex items-center">
                            <h1 className="text-[24px]">{ind + 1}</h1>
                          </div>
                          <div className="flex w-full items-center justify-between gap-[15px]">
                            <div className="h-[70px] w-[21%]">
                              <img
                                src={`${imageBaseUrl}${movie.backdrop_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="w-[75%]">
                              <div className="flex items-center justify-between">
                                <h3 className="text-white font-normal">
                                  {movie.title}
                                </h3>
                              </div>
                              <p className="text-[14px] text-[#d2d2d2] leading-5 w-[92%]">
                                {movie.overview.length > 124
                                  ? `${movie.overview.slice(0, 124)}...`
                                  : movie.overview}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center py-[34px] text-[#d2d2d2]">
                      No similar movies found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieandTvshowTrendingRow;
