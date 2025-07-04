"use client";

import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import HeaderPage from "../PageComponents/HeaderPage";
import { usePractitionerChangePasswordMutation } from "@/app/redux/api/practitioner.api"; // agregar importación del mutation

// Definición del esquema de validación con Zod para el cambio de contraseña
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8), // Cambiado a confirmNewPassword
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const validateWithZod = (values: PasswordFormValues) => {
  try {
    passwordSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Partial<PasswordFormValues> = {};
      error.errors.forEach((err) => {
        const key = err.path[0] as keyof PasswordFormValues;
        errors[key] = err.message;
      });
      return errors;
    }
    return {};
  }
};

const CambioPassword: React.FC = () => {
  const { data: session, status } = useSession();
  const formikRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(true); // Siempre en modo edición para el cambio de contraseña
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isTyping, setIsTyping] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Agregar hook del mutation para cambiar la contraseña
  const [changePassword] = usePractitionerChangePasswordMutation();

  if (status === "loading") return <p>Cargando...</p>;
  if (!session) return <p>Debes iniciar sesión</p>;

  const initialValues: PasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const handleSubmit = async (values: PasswordFormValues) => {
    const token = session?.user?.accessToken;
    if (!token) {
      console.error("❌ Token no disponible. No se enviará la solicitud.");
      return;
    }
    try {
      await changePassword({
        token: session?.user?.accessToken,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      }).unwrap();
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada correctamente!",
      });
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "¡Error al actualizar la contraseña!",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <div className="flex flex-col items-start justify-between gap-2 w-full">
        {/* Encabezado */}
        <div className="w-full">
          <HeaderPage
            urlRetorno="/medico/ajustes"
            titulo="Cambiar Contraseña"
          />
        </div>
        {/* Título */}
        <h1 className="text-2xl text-black font-bold text-left p-2">
          Cambio de contraseña
        </h1>
        {/* Contenedor del formulario */}
        <div className="overflow-y-auto w-full p-2">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validate={validateWithZod}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="text-black w-full bg-white p-3 rounded-box space-y-4">
                <div className="flex flex-col gap-4">
                  {/* Campo: contraseña actual */}
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-black"
                    >
                      Ingrese su contraseña actual*
                    </label>
                    <div className="relative">
                      {/* Ícono de candado en la izquierda usando lucide-react */}
                      {isTyping.currentPassword ? (
                        <Unlock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      ) : (
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <Field
                        type={showCurrent ? "text" : "password"}
                        name="currentPassword"
                        placeholder="contraseña actual"
                        className="w-full p-3 pl-10 pr-20 border-2 border-[#A4D4D4] rounded-lg bg-gray-100"
                        readOnly={!isEditing}
                        onInput={() =>
                          setIsTyping((prev) => ({
                            ...prev,
                            currentPassword: true,
                          }))
                        }
                        onBlur={() =>
                          setIsTyping((prev) => ({
                            ...prev,
                            currentPassword: false,
                          }))
                        }
                      />
                      {/* Botón derecho para ver/ocultar contraseña */}
                      <button
                        type="button"
                        onClick={() => setShowCurrent((prev) => !prev)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {showCurrent ? (
                          <Eye className="h-5 w-5 text-gray-600" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Campo: nueva contraseña */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-black"
                    >
                      Ingrese su nueva contraseña*
                    </label>
                    <div className="relative">
                      {isTyping.newPassword ? (
                        <Unlock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      ) : (
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <Field
                        type={showNew ? "text" : "password"}
                        name="newPassword"
                        placeholder="nueva contraseña"
                        className="w-full p-3 pl-10 pr-20 border-2 border-[#A4D4D4] rounded-lg bg-gray-100" 
                        readOnly={!isEditing}
                        onInput={() =>
                          setIsTyping((prev) => ({
                            ...prev,
                            newPassword: true,
                          }))
                        }
                        onBlur={() =>
                          setIsTyping((prev) => ({
                            ...prev,
                            newPassword: false,
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((prev) => !prev)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {showNew ? (
                          <Eye className="h-5 w-5 text-gray-600" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Campo: confirmar contraseña */}
                  <div>
                    <label
                      htmlFor="confirmNewPassword"
                      className="block text-black"
                    >
                      Ingrese nuevamente*
                    </label>
                    <div className="relative">
                      {isTyping.confirmPassword ? (
                        <Unlock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      ) : (
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <Field
                        type={showConfirm ? "text" : "password"}
                        name="confirmNewPassword"
                        placeholder="confirmar contraseña"
                        className="w-full p-3 pl-10 pr-20 border-2 border-[#A4D4D4] rounded-lg bg-gray-100"
                        readOnly={!isEditing}
                        onInput={() =>
                          setIsTyping((prev) => ({
                            ...prev,
                            confirmPassword: true,
                          }))
                        }
                        onBlur={() =>
                          setIsTyping((prev) => ({
                            ...prev,
                            confirmPassword: false,
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirm ? (
                          <Eye className="h-5 w-5 text-gray-600" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmNewPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
                <div className="flex gap-10 justify-center">
                  {isEditing ? (
                    <>
                      <button
                        type="reset"
                        className="w-48 font-bold py-2 bg-transparent text-[#078B8C] border-2 border-[#078B8C] rounded-lg hover:bg-gray-600"
                      >
                        Restablecer
                      </button>
                      <button
                        type="submit"
                        className="w-48 font-bold py-2 bg-[#078B8C] text-white rounded-lg hover:bg-[#133030]"
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="w-48 font-bold py-2 bg-[#078B8C] text-white rounded-lg hover:bg-[#133030]"
                      onClick={() => setIsEditing(true)}
                    >
                      Editar
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CambioPassword;
