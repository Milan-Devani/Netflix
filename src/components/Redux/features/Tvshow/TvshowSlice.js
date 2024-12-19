import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAiringTodayTvshow,
  fetchBannerTvshow,
  fetchPopularTvshow,
  fetchTrendingTvshow,
  fetchTVCertifications,
  fetchTVShow,
  fetchTvshowCedites,
  // fetchTvshowCertifications,
  fetchTvshowdetails,
  fetchTvshowEpisode,
  fetchTvshowSeason,
  fetchTvshowTrailer,
} from "../../../Api/api";

export const getBannerTvshow = createAsyncThunk(
  'Tvshow/getBannerTvshow',
  async (_ , { rejectWithValue }) => {
    try {
      const tvshow = await fetchBannerTvshow();
      return tvshow;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAiringTodayTVShow = createAsyncThunk(
  "tvshow/AiringToday",
  async (_, { rejectWithValue }) => {
    try {
      const tvshows = await fetchAiringTodayTvshow();
      return tvshows;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching trending TV shows
 
export const getTrendingTvshow = createAsyncThunk(
  'movies/getTrendingTvshow',
  async (timeWindow, { rejectWithValue }) => {
    try {
      const tvshow = await fetchTrendingTvshow(timeWindow);
      return tvshow;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const getPopularTvshow = createAsyncThunk(
  'Tvshow/getPopularTvshow',
  async (_ , { rejectWithValue }) => {
    try {
      const tvshow = await fetchPopularTvshow();
      return tvshow;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTVShow = createAsyncThunk(
  "tvshow/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const tvshows = await fetchTVShow();
      return tvshows;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTvshowDetails = createAsyncThunk(
  "tvshow/getTvshowDetails",
  async (tvshowId, { rejectWithValue }) => {
    try {
      const TvshowDetail = await fetchTvshowdetails(tvshowId); // Pass movieId here
      return TvshowDetail;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTvshowCedites = createAsyncThunk(
  "tvshow/getTvshowCedites",
  async (tvshowId, { rejectWithValue }) => {
    try {
      const Tvshowcast = await fetchTvshowCedites(tvshowId); // Pass movieId here
      return Tvshowcast;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTvshowEpisode = createAsyncThunk(
  'tvshow/gettvshowepisode',
  async (tvshowId, { rejectWithValue }) => {
    try {
      const tvepisode = await fetchTvshowEpisode(tvshowId);
      return tvepisode;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTvshowTrailer = createAsyncThunk(
  "tvshow/getTvshowIdTrailer",
  async (tvshowId, { rejectWithValue }) => {
    try {
      const trailerKey = await fetchTvshowTrailer(tvshowId);
      return trailerKey;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getTvshowSeason = createAsyncThunk(
  "tvshow/getTvshowSeason",
  async ({ seasonId, seasonNumber }, { rejectWithValue }) => {
    try {
      // console.log("Season ID:", seasonId, "Season Number:", seasonNumber);
      const tvseasonepisode = await fetchTvshowSeason(seasonId, seasonNumber);
      return tvseasonepisode;
    } catch (error) {
      console.error("Error in getTvshowSeason thunk:", error);
      return rejectWithValue(error.message);
    }
  }
);



export const getTVCertifications = createAsyncThunk(
  'certifications/fetchTVCertifications',
  async () => {
    const data = await fetchTVCertifications();
    return data;
  }
);

const TvshowSlice = createSlice({
  name: "Tvshow",
  initialState: {
    BannerTvshow : [],
    getTvshow: [],
    AiringTodayTVShow: [],
    TvshowEpisode: [],
    selectedTvshowDetails: [],
    Trendingtvshow:[],
    PopularTvshow:[],
    certifications:[],
    selectedTvshowCedites: [],
    selectedTvshowseasonep: [],
    trailerKey: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder

    .addCase(getBannerTvshow.pending, (state) => {
      state.status = "loading";
    })
    .addCase(getBannerTvshow.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.BannerTvshow = action.payload.results || [];
    })
    .addCase(getBannerTvshow.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })

      .addCase(getAiringTodayTVShow.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAiringTodayTVShow.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.AiringTodayTVShow = action.payload.results || [];
      })
      .addCase(getAiringTodayTVShow.rejected, (state, action) => {
        state.status = "failed";
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

      .addCase(getPopularTvshow.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(getPopularTvshow.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.PopularTvshow = action.payload;
      })

      .addCase(getPopularTvshow.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getTVShow.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTVShow.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.getTvshow = action.payload.results || [];
      })
      .addCase(getTVShow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getTvshowDetails.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.selectedTvshowDetails = action.payload;
        state.status = "succeeded";
      })
      .addCase(getTvshowDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTvshowDetails.rejected, (state, action) => {
        state.error = action.error.message;
      })

       // Tvshow Trailer
       .addCase(getTvshowTrailer.pending, (state) => {
        state.status = 'loading'; // Optional: Track loading state for fetching trailer
      })
      .addCase(getTvshowTrailer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trailerKey = action.payload;
      })
      .addCase(getTvshowTrailer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getTvshowCedites.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.selectedTvshowCedites = action.payload;
        state.status = "succeeded";
      })
      .addCase(getTvshowCedites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTvshowCedites.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(getTvshowEpisode.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.TvshowEpisode = action.payload;
        state.status = "succeeded";
      })
      .addCase(getTvshowEpisode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTvshowEpisode.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(getTvshowSeason.fulfilled, (state, action) => {
        state.trailerKey = action.payload.trailerKey;
        state.selectedTvshowseasonep = action.payload;
        state.status = "succeeded";
      })
      .addCase(getTvshowSeason.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTvshowSeason.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(getTVCertifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTVCertifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.certifications = action.payload;
      })
      .addCase(getTVCertifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default TvshowSlice.reducer;
