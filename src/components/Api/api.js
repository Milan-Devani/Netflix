import axios from "axios";

const API_KEY = "ea4346be84e1bd35ec37697f840a648c";
const BASE_URL = "https://api.themoviedb.org/3";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTQzNDZiZTg0ZTFiZDM1ZWMzNzY5N2Y4NDBhNjQ4YyIsIm5iZiI6MTcyOTUwMjIzNi4xNzgwNjEsInN1YiI6IjY3MTRkZjk2MGNiNjI1MmY5OTA4YjJhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GpUh_tNfqaEOz1Aczrw8tSS7cUgLDs7B5xPICudTvJg"; // Replace with your Bearer token


export const fetchTrendingMoviesandTvshow = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/all/week`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchNowplayMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTrendingMovies = async (timeWindow = "day") => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/${timeWindow}`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTrendingTodayMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/day`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page: 2,
      },
      headers: {
        accept: "application/json",
        Authorization: AUTH_TOKEN,
      },
    });
    // console.log("Popular response" , response);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTopRatedMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page: 1,
      },
      headers: {
        accept: "application/json",
        Authorization: AUTH_TOKEN,
      },
    });
    // console.log("Popular response" , response);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchUpcomingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page: 2,
      },
      headers: {
        accept: "application/json",
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchMovieTrailer = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });

    const trailers = response.data.results;

    // Filter for a YouTube trailer with type "Trailer"
    const officialTrailer = trailers.find(
      (trailer) => trailer.type === "Trailer" && trailer.site === "YouTube"
    );

    if (!officialTrailer) {
      throw new Error("Trailer not found");
    }

    return officialTrailer.key;
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    return null;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchMovieCedites = async (movieId) => {
  try {
    // console.log(`Fetching movie credits for ID: ${movieId}`); 
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    return response.data.cast;
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    return null;
  }

};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchBannerTvshow = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated` , {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page: 1,
      },
      headers: {
        accept: "application/json",
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching banner tvshow:", error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchMoviedetails = async (movieId) => {
  try {
    // console.log(`Fetching movie details for ID: ${movieId}`); // Debugging line
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    return null;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchCertifications = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/release_dates`,
      {
        params: {
          api_key: API_KEY,
        },
      }
    );

    const usCertifications = response.data.results.find(
      (result) => result.iso_3166_1 === "US"
    );
    if (usCertifications) {
      return usCertifications.release_dates;
    }
    return [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchMovieSimilar = async (movieId) => {
  try {
    // console.log(`Fetching movie similar for ID: ${movieId}`); // Debugging line
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    return null;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Tv-shows-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Tv-shows-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Tv-shows-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Tv-shows-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Tv-shows-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Tv-shows-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\\

export const fetchTrendingTvshow = async (timeWindow = "day") => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/tv/${timeWindow}`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });4
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTopRatedTvshow = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });4
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchAiringTodayTvshow = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated` , {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page: 2,
      },
      headers: {
        accept: "application/json",
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchPopularTvshow = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated` , {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page: 3,
      },
      headers: {
        accept: "application/json",
        Authorization: AUTH_TOKEN,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTVShow = async () => {
  const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
    params: {
      api_key: API_KEY,
    },
    headers: {
      Authorization: AUTH_TOKEN,
      accept: "application/json",
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch data");
  }
  // console.log("API Response:", response.data); // Add this line for debugging
  return response.data;
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTvshowdetails = async (tvshowId) => {
  try {
    // console.log(`Fetching tvshow details for ID: ${tvshowId}`); // Debugging line
    const response = await axios.get(`${BASE_URL}/tv/${tvshowId}`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tvshow trailer:", error);
    return null;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTvshowCedites = async (tvshowId) => {
  try {
    // console.log(`Fetching tvshow credits for ID: ${tvshowId}`); // Debugging line
    const response = await axios.get(`${BASE_URL}/tv/${tvshowId}/credits`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    return response.data.cast;
  } catch (error) {
    console.error("Error fetching tvshow trailer:", error);
    return null;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTvshowEpisode = async (tvshowId) => {
  try {
    // console.log(`Fetching tv for ID: ${tvshowId}`); // Debugging line
    const response = await axios.get(`${BASE_URL}/tv/${tvshowId}/episode_groups`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tvshow episode :', error);
    return null;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTvshowTrailer = async (tvshowId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${tvshowId}/videos`, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });

    const trailers = response.data.results;

    // Filter for a YouTube trailer with type "Trailer"
    const officialTrailer = trailers.find(
      (trailer) => trailer.type === "Trailer" && trailer.site === "YouTube"
    );

    if (!officialTrailer) {
      throw new Error("Trailer not found");
    }

    return officialTrailer.key;
  } catch (error) {
    console.error("Error fetching tvshow trailer:", error);
    return null;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTvshowSeason = async (seasonId, seasonNumber) => {
  try {
    // console.log(`Fetching season for TV show with ID: ${seasonId}, Season: ${seasonNumber}`);
    const response = await axios.get(
      `${BASE_URL}/tv/${seasonId}/season/${seasonNumber}`,
      {
        params: {
          api_key: API_KEY,
        },
        headers: {
          Authorization: AUTH_TOKEN,
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tvshow season:", error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

export const fetchTVCertifications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/certification/tv/list`, {
      params: { api_key: API_KEY },
    });
    return response.data.certifications; // Returns the certifications list
  } catch (error) {
    console.error('Error fetching TV certifications:', error);
    throw error;
  }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Search-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Search-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Search-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Search-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Search-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\\
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=Search-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\\

export const searchMoviesandTvshow = async (query) => {
  // console.log("Query:", query);
  try {
    const response = await axios.get(`${BASE_URL}/search/multi`, {
      params: {
        api_key: API_KEY,
        query, 
      },
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
    });
    // console.log("Response Data:", response.data.results);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};
