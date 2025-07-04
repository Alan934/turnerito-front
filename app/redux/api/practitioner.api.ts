import { Practitioner, PractitionerGet, TokenWithEntity } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const practitionerAPI = createApi({
  reducerPath: "practitioner",
  tagTypes: ["Practitioner"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllPractitioners: builder.query<PractitionerGet, void>({
      query: () => "/practitioner",
      providesTags: (result) =>
        result
          ? result.data.map(({ id }) => ({ type: "Practitioner", id }))
          : [],
    }),
    getAllPractitionersIncludingDelete: builder.query<PractitionerGet, void>({
      query: () => "/practitioner/including-deleted",
      providesTags: (result) =>
        result
          ? result.data.map(({ id }) => ({ type: "Practitioner", id }))
          : [],
    }),
    getAllPractitionersWithTurns: builder.query<PractitionerGet, void>({
      query: () => "/practitioner/with-turns",
      providesTags: (result) =>
        result
          ? result.data.map(({ id }) => ({ type: "Practitioner", id }))
          : [],
    }),
    getOnePractitioner: builder.query<Practitioner, string | number>({
      query: (id) => `/practitioner/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "Practitioner", id }] : [],
    }),
    getOnePractitionerByNameAndLicense: builder.query<Practitioner, {name:string,license:string}>({
      query: (params) => `/practitioner/search/by-name-license?name=${params.name}&license=${params.license}`,
      providesTags: (result,) =>
        result ? [{ type: "Practitioner", id:"LIST" }] : [],
    }),
    //TO DO: definir un tipo de retorno apropiado, revisar tags  
    getPractitionerSISAData: builder.query({
      query: (id)=>`/practitioner/sisa-data/${id}`
    }),
    createPractitioner: builder.mutation<Practitioner, Partial<Practitioner>>({
      query: (body) => ({
        url: "/practitioner",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Practitioner"],
    }),
    createPractitionerValidateSisa: builder.mutation<Practitioner, Partial<Practitioner>>({
      query: (body) => ({
        url: "/practitioner/validate-sisa",
        method: "POST",
        body,
      }),
      invalidatesTags:["Practitioner"]
    }),
    updatePractitioner: builder.mutation<Practitioner, TokenWithEntity>({
      query: (args) => ({
        url: `/practitioner/${args.entity.id}`,
        method: "PATCH",
        body:args.entity,
        headers:{
          "Authorization":`Bearer ${args.token}`
        }
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Practitioner", id: args.entity.id },
      ],
    }),
    updatePractitionerRestore: builder.mutation<Practitioner, Partial<Practitioner>>({
      query: (body) => ({
        url: `/practitioner/restore/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Practitioner", id: args.id },
      ],
    }),
    updatePractitionerRecover: builder.mutation<Practitioner, Partial<Practitioner>>({
      query: (body) => ({
        url: `/practitioner/recover/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Practitioner", id: args.id },
      ],
    }),
    updateAvatar: builder.mutation<Practitioner, TokenWithEntity>({
      query: (args) => ({
        url: `/practitioner/${args.entity.id}`,
        method: "PATCH",
        body:args.entity,
        headers:{
          "Authorization":`Bearer ${args.token}`
        }
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Practitioner", id: args.entity.id },
      ],
    }),
    deletePractitioner: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/practitioner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Practitioner", id: args },
      ],
    }),
    practitionerSoftDelete: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/practitioner/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Practitioner", id: args },
      ],
    }),
practitionerChangePassword: builder.mutation<
  void,
  { token: string; currentPassword: string; newPassword: string; confirmNewPassword: string }
>({
  query: ({ token, ...body }) => ({
    url: `/auth/change-password`, 
    method: "PATCH",
    body,
    headers: { "Authorization": `Bearer ${token}` },
  }),
  onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    try {
      await queryFulfilled;
      dispatch(
        practitionerAPI.util.invalidateTags([
          { type: "Practitioner", id: "CURRENT" }
        ])
      );
    } catch (error) {
      console.error(error);
    }
  },
}),
  }),
});
export const {
  useGetAllPractitionersQuery,
  useGetOnePractitionerQuery,
  useLazyGetOnePractitionerQuery,
  useGetAllPractitionersIncludingDeleteQuery,
  useGetAllPractitionersWithTurnsQuery,
  useGetOnePractitionerByNameAndLicenseQuery,
  useGetPractitionerSISADataQuery,
  useCreatePractitionerValidateSisaMutation,
  useCreatePractitionerMutation,
  useUpdatePractitionerMutation,
  useUpdatePractitionerRecoverMutation,
  useUpdatePractitionerRestoreMutation,
  useUpdateAvatarMutation,
  useDeletePractitionerMutation,
  usePractitionerSoftDeleteMutation,
  usePractitionerChangePasswordMutation,
} = practitionerAPI;