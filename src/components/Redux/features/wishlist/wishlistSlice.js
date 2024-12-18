import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlistitem',
  initialState: {
    items: [], // Array to store wishlist movies
  },
  reducers: {
    movieaddToWishlist: (state, action) => {
      state.items.push(action.payload); // Add the movie to the wishlist
    },
    tvshowaddToWishlist: (state, action) => {
      state.items.push(action.payload); // Add the TV show to the wishlist
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id); // Remove the movie
    },
  },
});

export const { movieaddToWishlist, tvshowaddToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;





// import { createSlice } from '@reduxjs/toolkit';

// const wishlistSlice = createSlice({
//   name: 'wishlistitem',
//   initialState: {
//     items: [], // Array to store wishlist movies
//   },
//   reducers: {
//     movieaddToWishlist: (state, action) => {
//       state.items.push(action.payload); // Add the movie to the wishlist
//     },
//     tvshowaddToWishlist: (state, action) => {
//       state.items.push(action.payload); // Add the movie to the wishlist
//     },
//   },
// });

// export const { movieaddToWishlist , tvshowaddToWishlist } = wishlistSlice.actions;
// export default wishlistSlice.reducer;




// import { createSlice } from '@reduxjs/toolkit';

// const wishlistSlice = createSlice({
//   name: 'wishlistitem',
//   initialState: {
//     items: [], // Array to store wishlist movies
//   },
//   reducers: {
//     movieaddToWishlist: (state, action) => {
//       state.items.push(action.payload); // Add the movie to the wishlist
//     },
//     removemovieFromWishlist: (state, action) => {
//       state.items = state.items.filter((item) => item.id !== action.payload.id); // Remove the movie by id
//     },
//     removeTvshowFromWishlist: (state, action) => {
//       state.items = state.items.filter((item) => item.id !== action.payload.id); // Remove the movie by id
//     },
//     tvshowaddToWishlist: (state, action) => {
//       state.items.push(action.payload); // Add the movie to the wishlist
//     },
//   },
// });

// export const { movieaddToWishlist , removemovieFromWishlist , removeTvshowFromWishlist , tvshowaddToWishlist } = wishlistSlice.actions;
// export default wishlistSlice.reducer;
