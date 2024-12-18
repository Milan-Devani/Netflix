import React, { useEffect, useState } from "react";
import Banner from "./Moviepage/Banner";
import MovieandTvshowTrendingRow from "./Moviepage/MovieandTvshowTrendingRow";
import MovieRow from "./Moviepage/TrendingMovieRow";
import TvshowRowTrending from "./Tvshowpage/TvshowRowTrending";
import PopularMoviesRow from "./Moviepage/PopularMoviesRow";
import TopRatedMovie from "./Moviepage/TopRatedMovie";
import UpcomingMovie from "./Moviepage/UpcomingMovie";
import TrendingMovieRow from "./Moviepage/TrendingMovieRow";
import NowPlayMoviePage from "./Moviepage/NowPlayMovieRow";
import Navbar from "./Navbar";
import Preloader from "./Preloader";
import Homebanner from "./Homepage/Homebanner";

function NetflixMoviepage() {
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
        {/* <Homebanner /> */}
        <div className="px-[15px]">
          <TrendingMovieRow />
          <NowPlayMoviePage />
          <PopularMoviesRow />
          <TopRatedMovie />
          <UpcomingMovie />
        </div>
      </div>
    </div>
  );
}

export default NetflixMoviepage;
