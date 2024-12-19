import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCertifications, fetchMovieCedites, fetchMoviedetails, fetchMovieSimilar, fetchMovieTrailer, fetchNowplayMovies, fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchTrendingMoviesandTvshow, fetchTrendingTodayMovies, fetchTrendingTvshow, fetchUpcomingMovies } from '../../../Api/api';

// Async thunk for fetching trending movies
export const getNowplayMovies = createAsyncThunk(
  'movies/getNowplayMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await fetchNowplayMovies();
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTrendingMovies = createAsyncThunk(
  'movies/getTrendingMovies',
  async (timeWindow, { rejectWithValue }) => {
    try {
      const movies = await fetchTrendingMovies(timeWindow);
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching trending movies today (renamed)
export const getTrendingTodayMovies = createAsyncThunk(
  'movies/getTrendingTodayMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await fetchTrendingTodayMovies();
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getTrendingMoviesandTvshow = createAsyncThunk(
  'movies/getTrendingMovieTvshow',
  async (_, { rejectWithValue }) => {
    try {
      const movieandTvshow = await fetchTrendingMoviesandTvshow();
      return movieandTvshow;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching trending TV shows
// export const getTrendingTvshow = createAsyncThunk(
//   'movies/getTrendingTvshow',
//   async (_, { rejectWithValue }) => {
//     try {
//       const movies = await fetchTrendingTvshow();
//       return movies;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const getTrendingTvshow = createAsyncThunk(
  'tvshow/getTrendingTvshow',
  async (timeWindow, { rejectWithValue }) => {
    try {
      const tvshow = await fetchTrendingTvshow(timeWindow);
      return tvshow;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Async thunk for fetching popular movies
export const getPopularMovies = createAsyncThunk(
  'movies/getPopularMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await fetchPopularMovies();
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTopRatedMovies = createAsyncThunk(
  'movies/getTopRatedMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await fetchTopRatedMovies();
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getUpcomingMovies = createAsyncThunk(
  'movies/getUpcomingMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await fetchUpcomingMovies();
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a movie trailer by ID
export const getMovieTrailer = createAsyncThunk(
  'movies/getMovieTrailer',
  async (movieId, { rejectWithValue }) => {
    try {
      const trailerKey = await fetchMovieTrailer(movieId);
      return trailerKey;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

 
export const getMovieCedites = createAsyncThunk(
  'movies/getMovieCedites',
  async (movieId, { rejectWithValue }) => {
    try {
      const moviecast = await fetchMovieCedites(movieId); // Pass movieId here
      return moviecast;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getMovieDetails = createAsyncThunk(
  'movies/getMovieDetails',
  async (movieId, { rejectWithValue }) => {
    try {
      const movieDetail = await fetchMoviedetails(movieId); // Pass movieId here
      return movieDetail;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMovieCertifications = createAsyncThunk(
  'movies/getMovieCertifications',
  async (movieId, { rejectWithValue }) => {
    try {
      const movieCertifications = await fetchCertifications(movieId); // Pass movieId here
      return movieCertifications;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getMovieSimilar = createAsyncThunk(
  'movies/getMovieSimilar',
  async (movieId, { rejectWithValue }) => {
    try {
      const movieSimilar = await fetchMovieSimilar(movieId); // Pass movieId here
      return movieSimilar;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    TrendingMovie: [],
    PopularMovies: [],
    TopRatedMovie:[],
    UpcomingMovies:[],
    Nowplaymovies :[],
    Trendingmovieandtvshow:[],
    selectedMovieCedites : [],
    selectedMovieDetails:[],
    selectedMovieCertifications:[],
    todaytrending: [],
    SimilarMovies :[],
    trailerKey: null,
    status: 'idle',
    error: null,
  },
  
  reducers: {},
  extraReducers: (builder) => {
    builder

    .addCase(getNowplayMovies.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getNowplayMovies.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.Nowplaymovies = action.payload;
    })
    .addCase(getNowplayMovies.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })

      // Trending Movies
      .addCase(getTrendingMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTrendingMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.TrendingMovie = action.payload;
      })
      .addCase(getTrendingMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Trending Movies Today
      .addCase(getTrendingTodayMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTrendingTodayMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todaytrending = action.payload;
      })
      .addCase(getTrendingTodayMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getTrendingMoviesandTvshow.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTrendingMoviesandTvshow.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Trendingmovieandtvshow = action.payload;
      })
      .addCase(getTrendingMoviesandTvshow.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Trending TV Shows
      .addCase(getTrendingTvshow.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTrendingTvshow.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Trendingtvshow = action.payload;
      })
      .addCase(getTrendingTvshow.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Popular Movies
      .addCase(getPopularMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPopularMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.PopularMovies = action.payload;
      })
      .addCase(getPopularMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getTopRatedMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTopRatedMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.TopRatedMovie = action.payload;
      })
      .addCase(getTopRatedMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getUpcomingMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUpcomingMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.UpcomingMovies = action.payload;
      })
      .addCase(getUpcomingMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Movie Trailer
      .addCase(getMovieTrailer.pending, (state) => {
        state.status = 'loading'; // Optional: Track loading state for fetching trailer
      })
      .addCase(getMovieTrailer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trailerKey = action.payload;
      })
      .addCase(getMovieTrailer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getMovieCedites.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.selectedMovieCedites = action.payload;
        state.status = "succeeded";
      })
      .addCase(getMovieCedites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMovieCedites.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // MovieDetails 

      .addCase(getMovieDetails.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.selectedMovieDetails = action.payload;
        state.status = "succeeded";
      })
      .addCase(getMovieDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMovieDetails.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // selectedMovieCertifications

      .addCase(getMovieCertifications.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.selectedMovieCertifications = action.payload;
        state.status = "succeeded";
      })
      .addCase(getMovieCertifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMovieCertifications.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Movie Similar Movies

      .addCase(getMovieSimilar.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.SimilarMovies = action.payload;
        state.status = "succeeded";
      })
      .addCase(getMovieSimilar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMovieSimilar.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default movieSlice.reducer;


