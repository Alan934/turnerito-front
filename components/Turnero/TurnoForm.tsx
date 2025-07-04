"use client";
import {
  AppointmentCreate,
  DocumentTypes,
  Gender,
  Patient,
  Practitioner,
  TurnStatus,
} from "@/app/definitions/definitions";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { z, ZodError } from "zod";
import Image from "next/image";
import Swal from "sweetalert2";
import { useCreateAppointmentMutation } from "@/app/redux/api/appointment.api";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { turnoSchema } from "@/app/utils/ZodSchemas/TurnoSchema";
import { isHorarioExpirado } from "@/app/utils/helperFunctions";

interface Props {
  practitioner: Practitioner;
}

export default function TurnoForm({ practitioner }: Props) {
  const [createTurn, { error: errorCreate }] = useCreateAppointmentMutation();
  const { data: session } = useSession();
  const reprogramAppointment = useSelector((state: RootState) => state.turno);
  const [reprogramFlag, setReprogramFlag] = useState<boolean>(false);

  useEffect(() => {
    if (reprogramAppointment.id !== "") {
      setReprogramFlag(true);
    }
  }, [reprogramAppointment]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        nombre: reprogramAppointment?.patient?.name || "",
        apellido: reprogramAppointment?.patient?.lastName || "",
        tipoDoc:
          reprogramAppointment?.patient?.documentType || DocumentTypes.dni,
        nroDoc: reprogramAppointment?.patient?.dni || "",
        obraSocial:
          reprogramAppointment?.patient?.socialWorkEnrollment?.socialWork?.id ||
          "7b84a5e6-8766-4047-8447-7184de17098e",
        nroAfiliado:
          reprogramAppointment?.patient?.socialWorkEnrollment?.memberNum || "",
        fechaNac: reprogramAppointment?.patient?.birth || "",
        email: reprogramAppointment?.patient?.email || "",
        telefono: reprogramAppointment?.patient?.phone || "",
        genero: reprogramAppointment?.patient?.gender || Gender.male,
        fechaTurno: localStorage.getItem("fechaTurno") || "",
        horaTurno: localStorage.getItem("horaTurno") || "",
      }}
      validate={(values) => {
        try {
          turnoSchema.parse(values);
          return {};
        } catch (errors) {
          if (errors instanceof ZodError) {
            // Declarar el tipo explícito para formErrors
            const formErrors: Record<string, string> = {};

            errors.issues.forEach((issue) => {
              const key = issue.path[0]; // TypeScript ahora entiende que es string
              if (typeof key === "string") {
                formErrors[key] = issue.message;
              }
            });
            console.log("Errores de validacion", formErrors);
            return formErrors;
          }
        }
      }}
      onSubmit={(values) => {
        if (isHorarioExpirado(session)) {
          return;
        } else {
          let appointment: Partial<AppointmentCreate> = {};
          if (reprogramFlag) {
            appointment = {
              date: values.fechaTurno,
              hour: values.horaTurno,
              status: TurnStatus.pending,
              practitionerIds: [{ id: practitioner.id }],
              patientId: reprogramAppointment.patient?.id,
            };
          } else {
            const patient: Partial<Patient> = {
              name: values.nombre,
              lastName: values.apellido,
              gender: values.genero,
              birth: values.fechaNac,
              documentType: DocumentTypes.dni,
              dni: values.nroDoc,
              email: values.email,
              phone: values.telefono,
              socialWorkEnrollment: {
                socialWork: {
                  id: values.obraSocial,
                },
                memberNum: values.nroAfiliado,
              },
            };
            appointment = {
              date: values.fechaTurno,
              hour: values.horaTurno,
              status: TurnStatus.pending,
              practitionerIds: [{ id: practitioner.id }],
              patient: patient,
            };
          }
          Swal.fire({
            title: `${reprogramFlag ? "Reprogramando" : "Solicitando"} Turno`,
            text: "Espere un momento",
            icon: "info",
            showConfirmButton: false,
            didOpen: async () => {
              try {
                const result = await createTurn(appointment).unwrap();
                if (errorCreate) {
                  Swal.close();
                  Swal.fire({
                    title: "Error",
                    text: `No se pudo ${
                      reprogramFlag ? "reprogramar" : "solicitar"
                    } el turno`,
                    icon: "error",
                  });
                  console.log("Error en createAppointment", errorCreate);
                } else if (result) {
                  Swal.close();
                  Swal.fire({
                    title: `${
                      reprogramFlag ? "Reprogramacion" : "Solicitud"
                    } Exitosa`,
                    text: `El turno fue ${
                      reprogramFlag ? "reprogramado" : "solicitado"
                    } con exito`,
                    icon: "success",
                    didClose: () => {
                      window.location.replace(
                        `/${session ? "medico" : "turnero"}/${result.id}`
                      );
                    },
                  });
                }
              } catch (e) {
                Swal.close();
                Swal.fire({
                  title: "Error",
                  text: "No se pudo solicitar el turno",
                  icon: "error",
                });
                console.log(e);
              }
            },
          });
        }
      }}
    >
      {({ errors, touched }) => (
        <div className="flex flex-col p-2 rounded-2xl border border-[#A4D4D4] bg-[#F1F1F1]">
          <div className="flex justify-start gap-2">
            <div>
              <Image
                src={practitioner.urlImg || "/UserIconPlaceholder.jpg"}
                alt="avatar"
                className="p-0.5 rounded-full border border-black"
                width={70}
                height={70}
              />
            </div>
            <div className="text-black flex flex-col items-start justify-center">
              <span className="font-semibold">
                {practitioner.gender == "male" ? `Dr.` : `Dra.`}{" "}
                {practitioner.name} {practitioner.lastName}
              </span>
              <span>Matricula Nro: {practitioner.license}</span>
              <span>Especialidad: {practitioner.practitionerRole[0].name}</span>
            </div>
          </div>
          <Form className="text-black space-y-2">
            <div className="flex flex-col">
              <label className="font-semibold">Nombre del Paciente</label>
              <Field
                name="nombre"
                placeholder="Maria"
                className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                  errors.nombre && touched.nombre && "border border-red-500"
                }`}
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Apellido del Paciente</label>
              <Field
                name="apellido"
                placeholder="Perez"
                className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                  errors.apellido && touched.apellido && "border border-red-500"
                }`}
              />
              <ErrorMessage
                name="apellido"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-[30%_70%] gap-[3px]">
              <div className="flex flex-col">
                <label className="font-semibold">Tipo</label>
                <Field
                  as="select"
                  name="tipoDoc"
                  className="border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2"
                >
                  <option value={DocumentTypes.dni}>DNI</option>
                  <option value={DocumentTypes.passport}>Pasaporte</option>
                </Field>
                <ErrorMessage
                  name="tipoDoc"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Numero de Documento</label>
                <Field
                  type="text"
                  name="nroDoc"
                  className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                    errors.nroDoc && touched.nroDoc && "border border-red-500"
                  }`}
                />
                <ErrorMessage
                  name="nroDoc"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Datos de Obra Social</label>
              <div className="space-y-1">
                <div className="flex flex-col">
                  <label>Seleccione una obra social</label>
                  <Field
                    as="select"
                    name="obraSocial"
                    className="border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2"
                  >
                    {practitioner.practitionerSocialWorks.map(
                      (obraSocial, index) => (
                        <option key={index} value={obraSocial.socialWork.id}>
                          {obraSocial.socialWork.name}
                        </option>
                      )
                    )}
                  </Field>
                  <ErrorMessage
                    name="obraSocial"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label>Numero de afiliado*</label>
                  <Field
                    type="text"
                    name="nroAfiliado"
                    placeholder="XXX-XXXX-XXXX/XX"
                    className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2`}
                  />
                  <ErrorMessage
                    name="nroAfiliado"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <span className="text-sm text-gray-800">
                    Si elegiste particular, deja el campo vacio*
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Telefono</label>
              <Field
                type="tel"
                name="telefono"
                placeholder="Ej: 54261234567"
                className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                  errors.telefono && touched.telefono && "border border-red-500"
                }`}
              />
              <ErrorMessage
                name="telefono"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Correo Electronico</label>
              <Field
                type="email"
                name="email"
                placeholder="Ej: ejemplo@ejemplo.com"
                className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                  errors.email && touched.email && "border border-red-500"
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Fecha de Nacimiento</label>
              <Field
                type="date"
                name="fechaNac"
                className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                  errors.fechaNac && touched.fechaNac && "border border-red-500"
                }`}
              />
              <ErrorMessage
                name="fechaNac"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Genero</label>
              <Field
                as="select"
                name="genero"
                className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                  errors.genero && touched.genero && "border border-red-500"
                }`}
              >
                <option value={Gender.male}>Masculino</option>
                <option value={Gender.female}>Femenino</option>
                <option value={Gender.other}>Otro</option>
              </Field>
              <ErrorMessage
                name="genero"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Fecha y hora del turno</label>
              <div className="grid grid-cols-[60%_38%] gap-2">
                <div>
                  <Field
                    type="date"
                    name="fechaTurno"
                    readOnly
                    className="border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2"
                  />
                  <ErrorMessage
                    name="fechaTurno"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Field
                    type="time"
                    name="horaTurno"
                    readOnly
                    className={`border border-[#078B8C] bg-[#A4D4D4] rounded-lg h-8 px-2 ${
                      errors.horaTurno &&
                      touched.horaTurno &&
                      "border border-red-500"
                    }`}
                  />
                  <ErrorMessage
                    name="horaTurno"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full">
              <button
                className="bg-[#078B8C] rounded-lg p-2 text-white "
                type="submit"
              >
                {reprogramFlag ? "Reprogramar Turno" : "Solicitar Turno"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
