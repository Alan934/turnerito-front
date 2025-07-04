import { TokenWithEntity } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authenticationApi = createApi({
  reducerPath: "authenticationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<void, string>({
      query: (email) => ({
        url: `/auth/forgot-password?email=${email}`,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation<void, TokenWithEntity>({
      query: (args) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body:args.entity,
        headers: {
          Authorization: `Bearer ${args.token}`,
        },
      }),
    }),
  }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation} =
  authenticationApi;
