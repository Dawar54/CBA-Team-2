import { apiSlice } from './apiSlice';

export const favoritesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFavorites: builder.query({
            query: () => ({
                url: '/api/favorites',
            }),
            providesTags: ['Favorite'],
        }),
        addFavorite: builder.mutation({
            query: (data) => ({
                url: '/api/favorites',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Favorite'],
        }),
        removeFavorite: builder.mutation({
            query: (productId) => ({
                url: `/api/favorites/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Favorite'],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
} = favoritesApiSlice;
