import { DocumentTypes, Gender } from "@/app/definitions/definitions";
import { z } from "zod";

export const turnoSchema = z
  .object({
    nombre: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe introducir un mombre" }),
    apellido: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe introducir un apellido" }),
    tipoDoc: z.enum([DocumentTypes.dni, DocumentTypes.passport], {
      message: "Tipo de documento no valido",
    }),
    nroDoc: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe introducir un numero de documento" }),
    fechaNac: z.string({ required_error: "Campo Requerido" }).date(),
    genero: z.enum([Gender.male, Gender.female, Gender.other], {
      message: "Seleccion no valida",
    }),
    obraSocial: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe introducir una obra social" }),
    nroAfiliado: z.string().optional(),
    email: z
      .string({ required_error: "Campo Requerido" })
      .email({ message: "Formato Invalido" }),
    telefono: z
      .string({ required_error: "Campo Requerido" })
      .regex(new RegExp("^[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"), {
        message: "Debe introducir un numero de telefono valido",
      }),
    fechaTurno: z
      .string({ required_error: "Campo Requerido" })
      .min(1, { message: "Debe introducir una fecha" })
      .date(),
    horaTurno: z
      .string({ required_error: "Campo Requerido" })
      .regex(new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/), {
        message: "La hora no es valida",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.obraSocial != "7b84a5e6-8766-4047-8447-7184de17098e" && !data.nroAfiliado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nroAfiliado"],
        message: "Debe introducir un numero de afiliado",
      });
    }
  });
