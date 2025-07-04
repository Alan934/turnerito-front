import { Appointment, AppointmentGet } from "@/app/definitions/definitions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentAPI = createApi({
  reducerPath: "appointments",
  tagTypes: ["Appointments"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
    },
  }),
  endpoints: (builder) => ({
    getAllAppointments: builder.query<AppointmentGet, void>({
      query: () => "/appointment",
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAllAppointmentsIncludedDeleted: builder.query<AppointmentGet, void>({
      query: () => "/appointment/including-delete",
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getOneAppointment: builder.query<Appointment, string | number>({
      query: (id) => `/appointment/${id}`,
      providesTags: (result, error, id) =>
        result ? [{ type: "Appointments", id }] : [],
    }),
    getAppointmentsBySpecialist: builder.query<Appointment[], string | number>(
      {
        query: (id) => `/appointment/specialist/${id}`,
        providesTags: (result) =>
          result
            ? result.map(({ id }) => ({ type: "Appointments", id }))
            : [],
      }
    ),
    getAllAppointmentsBySpecialist: builder.query<
      AppointmentGet,
      string | number
    >({
      query: (id) => `/appointment/specialist-all/${id}`,
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAppointmentsByPatient: builder.query<AppointmentGet, string | number>({
      query: (id) => `/appointment/patient/${id}`,
      providesTags: (result) =>
        result
          ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
          : [],
    }),
    getAppointmentsByPatientAndPractitioner: builder.query<
      Appointment[],
      { patientId: string; practitionerId: string }
    >({
      query: ({ patientId, practitionerId }) =>
        `/appointment/patient/${patientId}/practitioner/${practitionerId}`,
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: "Appointments", id })) : [],
    }),
    getAllAppointmentsByPatient: builder.query<AppointmentGet, string | number>(
      {
        query: (id) => `/appointment/patient-all/${id}`,
        providesTags: (result) =>
          result
            ? result.turns.map(({ id }) => ({ type: "Appointments", id }))
            : [],
      }
    ),
    createAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: (body) => ({
        url: "/appointment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: (body) => ({
        url: `/appointment/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    cancelAppointment: builder.mutation<string, string | number>({
      query: (id) => ({
        url: `/appointment/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args },
      ],
    }),
    reprogramAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: (body) => ({
        url: `/appointment/reprogram/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    checkOverlap: builder.mutation<Appointment, Partial<Appointment>>({
      query: (body) => ({
        url: `/appointment/check-overlap/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    updateAppointmentStatus: builder.mutation<
      Appointment,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/appointment/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args.id },
      ],
    }),
    recoverAppointment: builder.mutation<Appointment, string | number>({
      query: (id) => ({
        url: `/appointment/recover/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args },
      ],
    }),
    softDeleteAppointment: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/appointment/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Appointments", id: args },
      ],
    }),
  }),
});
export const {
  useGetAllAppointmentsQuery,
  useGetOneAppointmentQuery,
  useGetAppointmentsBySpecialistQuery,
  useGetAllAppointmentsByPatientQuery,
  useGetAppointmentsByPatientQuery,
  useLazyGetAppointmentsByPatientAndPractitionerQuery,
  useGetAllAppointmentsBySpecialistQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useSoftDeleteAppointmentMutation,
  useCancelAppointmentMutation,
  useReprogramAppointmentMutation,
  useCheckOverlapMutation,
  useRecoverAppointmentMutation,
  useGetAllAppointmentsIncludedDeletedQuery,
  useLazyGetAppointmentsBySpecialistQuery,
} = appointmentAPI;
