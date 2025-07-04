import { SocialWorkGet } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const socialWorkApi = createApi({
  reducerPath: "socialWorkApi",
  tagTypes: ["SocialWork"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllSocialWorks: builder.query<SocialWorkGet, string>({
      query: (token) => ({
        url: "/social-work",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? result.socialWorks.map(({ id }) => ({ type: "SocialWork", id }))
          : ["SocialWork"],
    }),
    getOneSocialWork: builder.query<SocialWorkGet, string | number>({
      query: (id) => `/social-work/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "SocialWork", id }] : [],
    }),
  }),
});

export const {
  useGetAllSocialWorksQuery,
  useGetOneSocialWorkQuery,
  useLazyGetAllSocialWorksQuery,
} = socialWorkApi;
