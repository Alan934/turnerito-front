"use client";

import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useUpdatePractitionerMutation } from "@/app/redux/api/practitioner.api";
import Swal from "sweetalert2";
import { Practitioner, TokenWithEntity } from "@/app/definitions/definitions";
import HeaderPage from "../PageComponents/HeaderPage";
import { Session } from "next-auth";
import Image from "next/image";
import AvatarForm from "./AvatarForm";

// Definir el esquema de validación con Zod
const basicSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Correo inválido").min(1, "El correo es obligatorio"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
});

interface Props {
  practitioner: Practitioner;
}

// Tipo para los valores del formulario
type BasicFormValues = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  urlImg: string;
};

// Función de validación usando Zod que adapta los errores para Formik
const validateWithZod = (values: BasicFormValues) => {
  try {
    basicSchema.parse(values);
    return {}; // No hay errores
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Partial<BasicFormValues> = {};
      error.errors.forEach((err) => {
        errors[err.path[0] as keyof BasicFormValues] = err.message;
      });
      return errors;
    }
    return {};
  }
};

export default function CambioForm({ practitioner }: Props) {
  const { data: session, update } = useSession();
  const [updatePractitioner] = useUpdatePractitionerMutation();
  const formikRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [shouldResetAvatar, setShouldResetAvatar] = useState(false);

  if (status === "loading") return <p>Cargando...</p>;
  if (!session) return <p>Debes iniciar sesión</p>;

  const initialValues: BasicFormValues = {
    name: practitioner.name || "",
    lastName: practitioner.lastName || "",
    email: practitioner.email || "",
    phone: practitioner.phone || "",
    urlImg: practitioner.urlImg || "",
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#E4ECEC] w-full min-h-screen p-4">
      <div className="flex flex-col items-start w-full max-w-md">
        {/* Encabezado */}
        <div className="w-full mb-4">
          <HeaderPage urlRetorno="/medico/ajustes" titulo="Perfil" />
        </div>

        {/* Título */}
        <div className="w-full flex items-center justify-between p-3 mb-4">
          <h1 className="text-2xl text-black font-bold text-left ">Perfil</h1>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-4 border border-[#078B8C] text-[#078B8C] bg-transparent py-2 
                    px-4 rounded-lg"
            >
              <span>Editar</span>
              <Image
                src="\edit.svg"
                alt="Editar"
                width={16}
                height={16}
                className="pointer-events-none"
              />
            </button>
          )}
        </div>

        <AvatarForm
          practitioner={practitioner}
          editable={isEditing}
          shouldReset={shouldResetAvatar} 
          onResetComplete={() => setShouldResetAvatar(false)}
          onDoneEditing={() => setIsEditing(false)}
        />

        {/* Contenedor del formulario */}
        <div className="overflow-y-auto w-full">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validate={validateWithZod}
            onSubmit={async (values) => {
              try {
                const practitionerData: Partial<Practitioner> = {
                  id: session.user.id,
                  name: values.name,
                  lastName: values.lastName,
                  email: values.email,
                  phone: values.phone,
                };
                const patchData: TokenWithEntity = {
                  entity: practitionerData,
                  token: session.user.accessToken,
                };
                const result = await updatePractitioner(patchData).unwrap();
                if (result) {
                  Swal.fire({
                    icon: "success",
                    title: "¡Datos actualizados correctamente!",
                  });
                  const user = {
                    id: result.id,
                    name: result.name,
                    lastName: result.lastName,
                    email: result.email,
                    role: result.role,
                    urlImg: result.urlImg,
                  };
                  update((session: Session) => ({ ...session, user: user }));
                  //Verifica que el perfil se haya actualizado en la sesión
                  console.log("Perfil actualizado en la sesión", session.user);
                  setIsEditing(false);
                  setShouldResetAvatar(true); // Resetea el avatar al guardar
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "¡Error al actualizar los datos!",
                  });
                }
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form className="text-black w-full p-1">
                <div className="flex flex-col gap-4 mb-4 bg-white p-6 rounded-lg ">
                  <div>
                    <h1 className="text-2xl text-black font-bold text-left mb-2">
                      Información personal
                    </h1>
                  </div>
                  <div>
                    <label htmlFor="name" className="block">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Ingresa un nombre"
                      className="w-full p-3 border border-[#A4D4D4] rounded-lg text-gray-600"
                      readOnly={!isEditing}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Ingresa tu apellido"
                      className="w-full p-3 border border-[#A4D4D4] rounded-lg text-gray-600"
                      readOnly={!isEditing}
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="ejemplo@dominio.com"
                      className="w-full p-3 border border-[#A4D4D4] rounded-lg text-gray-600"
                      readOnly={!isEditing}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="Ingresa tu teléfono"
                      className="w-full p-3 border border-[#A4D4D4] rounded-lg text-gray-600"
                      readOnly={!isEditing}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div>
                  {isEditing && (
                    <div className="flex gap-10 justify-center mt-10 text-xl">
                      <button
                        type="button"
                        onClick={() => {
                          formikRef.current?.resetForm();
                          setShouldResetAvatar(true); // Activa el reset del avatar
                          setIsEditing(false);
                        }}
                        className="w-48 py-2 bg-transparent text-[#078B8C] border-2 border-[#078B8C] rounded-lg hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-48 py-2 bg-[#078B8C] text-white rounded-lg hover:bg-[#133030]"
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
