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
      state.items.push(action.payload); // Add the movie to the wishlist
    },
  },
});

export const { movieaddToWishlist , tvshowaddToWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
