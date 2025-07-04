import { combineReducers } from "@reduxjs/toolkit";
import { appointmentAPI } from "./api/appointment.api";
import { practitionerAPI } from "./api/practitioner.api";
import { practitionerRoleAPI } from "./api/practitionerRole.api";
import { practitionerAppointmentAPI } from "./api/practitionerAppointment.api";
import { turnoSlice } from "./slices/turno.slice";
import { authenticationApi } from "./api/authentication.api";
import { socialWorkApi } from "./api/socialWork.api";
import { practitionerSocialWorkAPI } from "./api/practitionerSocialWork.api";

export const reducers = combineReducers({
  [appointmentAPI.reducerPath]: appointmentAPI.reducer,
  [practitionerAPI.reducerPath]: practitionerAPI.reducer,
  [practitionerRoleAPI.reducerPath]: practitionerRoleAPI.reducer,
  [practitionerAppointmentAPI.reducerPath]: practitionerAppointmentAPI.reducer,
  [turnoSlice.name]: turnoSlice.reducer,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
  [socialWorkApi.reducerPath]: socialWorkApi.reducer,
  [practitionerSocialWorkAPI.reducerPath]: practitionerSocialWorkAPI.reducer,
});

export const middleware = [
  appointmentAPI.middleware,
  practitionerAPI.middleware,
  practitionerRoleAPI.middleware,
  practitionerAppointmentAPI.middleware,
  authenticationApi.middleware,
  socialWorkApi.middleware,
  practitionerSocialWorkAPI.middleware,
];
