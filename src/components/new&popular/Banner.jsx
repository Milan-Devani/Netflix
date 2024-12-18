import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrendingMovies,
  getMovieTrailer,
  getMovieDetails,
  getMovieCedites,
  getMovieSimilar,
  getNowplayMovies,
} from "../Redux/features/movies/movieSlice";
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
import { FaMinus } from "react-icons/fa";
import { movieaddToWishlist, removeFromWishlist } from "../Redux/features/wishlist/wishlistSlice";

const Banner = () => {
  
  const dispatch = useDispatch();
  const {
    Nowplaymovies,
    trailerKey,
    status,
    error,
    selectedMovieCedites,
    selectedMovieDetails,
    SimilarMovies,
  } = useSelector((state) => state.movies);
  const wishlistitem = useSelector((state) => state.wishlistitem.items);

  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // dispatch(getTrendingMovies());
    dispatch(getNowplayMovies());
  }, [dispatch]);


  console.log("Nowplaymoviedds" , Nowplaymovies);
  
  const isInWishlist = wishlistitem.some((item) => item.id === selectedMovie?.id);

  const handleWishlist = (movie) => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(movie)); // Remove from wishlist
    } else {
      dispatch(movieaddToWishlist(movie)); // Add to wishlist
    }
  };

  const handleGetTrailer = async (movieId) => {
    try {
      await dispatch(getMovieCedites(movieId)).unwrap();
      await dispatch(getMovieDetails(movieId)).unwrap();
      await dispatch(getMovieSimilar(movieId)).unwrap();
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
 
  let handlegenres = selectedMovieDetails.genres;
  console.log("hendlegenres", handlegenres);

  const closePopup = () => {
    setPopupIsOpen(false);
    setShowTrailer(false);
  };

  if (status === "loading") {
    return <p>Loading movies...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div>
      <div className="banner">
        <div className="movie-container relative top-[-80px]">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            speed={1000}
            navigation
            pagination={{ clickable: true }}
            className="movie-swiper"
          >
            {Nowplaymovies.slice(0, 5).map((movie, index) => (
              <SwiperSlide key={movie.id}>
                <div className="relative h-screen items-center">
                  <div className="">
                    <img
                      src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                      alt={movie.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute justify-center	 inset-0 bg-gradient-to-t from-black to-transparent flex flex-col p-8">
                    <h2 className="text-white text-[3.2vw] font-HelveticaNeue font-bold">
                      {movie.title}
                    </h2>
                    <p className="text-white font-NetflixSans font-light mt-4 max-w-[33rem] leading-[21.71px] text-[1.12vw]">
                      {movie.overview.length > 160
                        ? `${movie.overview.slice(0, 160)}...`
                        : movie.overview}
                    </p>
                    <div className="mt-4 flex">
                      <button
                        className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
                        onClick={() => {
                          handleGetTrailer(movie.id); 
                          setSelectedMovie(movie);
                        }}
                      >
                        <span>
                          <RiPlayLargeFill className="w-[25px] h-[25px]" />
                        </span>
                        Play
                      </button>
                      <button className="bg-[#6d6d6e]/70 flex text-[1.045vw] text-white px-4 gap-[10px] py-2 rounded font-NetflixSans font-bold">
                        <span>
                          <AiOutlineInfoCircle className="w-[25px] h-[25px]" />
                        </span>
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

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
                      src={`${imageBaseUrl}${selectedMovie.backdrop_path}`}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-[#181818] to-transparent">
                  <h1 className="text-3xl font-bold">{selectedMovie.title}</h1>

                  <div className="flex items-center mt-[40px]">
                    <div className="flex">
                      <button
                        onClick={() => setShowTrailer(!showTrailer)} // Toggle trailer
                        className="bg-white text-[1.045vw] flex items-center gap-[10px] text-black px-4 py-2 rounded mr-4 font-NetflixSans font-bold"
                      >
                        <span>
                          <RiPlayLargeFill className="w-[25px] h-[25px]" />
                        </span>
                        {showTrailer ? "Stop" : "Play"}{" "}
                      </button>
                    </div>

                    <div className="gap-[10px] flex">
                      {/* <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50 items-center justify-center flex ">
                        <TfiPlus className="w-5 h-5" />
                      </button> */}

{isInWishlist ? (
                      <button
                        onClick={() => handleWishlist(selectedMovie)}
                        className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] items-center justify-center ease-linear flex border-[#ffffff]/50"
                      >
                        <FaMinus className="wishlistbtn-icon w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleWishlist(selectedMovie)}
                        className="wishlistbtn w-[40px] h-[40px] rounded-full border-[2px] items-center justify-center ease-linear flex border-[#ffffff]/50"
                      >
                        <TfiPlus className="wishlistbtn-icon w-5 h-5" />
                      </button>
                    )}
                      <button className="w-[40px] h-[40px] rounded-full border-[2px] border-[#ffffff]/50  items-center justify-center flex">
                        <SlLike className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-[60px] flex justify-between">
                    <div className="w-[60%]">
                      <div className="flex items-center space-x-4">
                        <span className="text-[#46d369] font-NetflixSans">
                          New
                        </span>
                        <div className="text-[#bcbcbc] flex gap-[8px] items-center">
                          <span>3 Seasons</span>
                          <span className="">2024</span>
                          <div className="flex items-center justify-center w-[40px] h-[20px] border-[1px] border-[#808080] rounded-[4px]">
                            <span className="text-white text-[14px]">HD</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center p-2 rounded-md">
                        <div className="px-[4px] border-[1px] border-[#808080] text-[#808080] text-[11px] mr-2">
                          TV-MA
                        </div>
                        <div className="text-white flex text-[14px]">
                          {handlegenres.map((item, ind) => {
                            return (
                              <div key={ind}>
                                <p className="text-[14px] text-justify text-[#777777]">
                                  {item.name}
                                  {/* {ind < selectedMovieCedites.length - 1 && ","} */}
                                  {ind < 2 && ","}
                                </p>
                              </div>
                            );
                          })}
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
                        {selectedMovie.overview}
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
                    {SimilarMovies.slice(0, 10).map((movie, ind) => {
                      return (
                        <div className="flex items-start space-x-4 py-[34px] pl-[34px] pr-[50px] rounded border-b border-[#404040] bg-[#181818] hover:bg-[#404040]">
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
                    })}
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

export default Banner;
 