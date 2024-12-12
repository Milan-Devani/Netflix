import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Banner from "./Moviepage/Banner";
import MovieandTvshowTrendingRow from "./Moviepage/MovieandTvshowTrendingRow";
import Homebanner from "./Homepage/Homebanner";
import TvshowRowTrending from "./Tvshowpage/TvshowRowTrending";
import TrendingMovieRow from "./Moviepage/TrendingMovieRow";
import PopularMoviesRow from "./Moviepage/PopularMoviesRow";
import TopRatedMovie from "./Moviepage/TopRatedMovie";
import UpcomingMovie from "./Moviepage/UpcomingMovie";
import NowPlayMoviePage from "./Moviepage/NowPlayMovieRow";
import Preloader from "./Preloader";
import TvshowAiringToday from "./Tvshowpage/TvshowAiringToday";
import Populartv from "./Tvshowpage/Populartv";

function NetflixHomepage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="main-preloader">
        <Preloader />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-[80px]">
        <Navbar />
        <Homebanner />
        <div className="px-[15px]">
          <TrendingMovieRow />
          <TvshowRowTrending />
          <NowPlayMoviePage />
          <PopularMoviesRow />
          <Populartv />
          <TvshowAiringToday />
          <TopRatedMovie />
          <UpcomingMovie />
        </div>
      </div>
    </div>
  );
}

export default NetflixHomepage;
