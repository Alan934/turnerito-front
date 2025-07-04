"use client";
import { DocumentTypes, PractitionerRole } from "@/app/definitions/definitions";
import { useGetPractitionerSISADataQuery } from "@/app/redux/api/practitioner.api";
import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  values: {
    documentType: string;
    dni: string;
  };
  errors: FormikErrors<{
    documentType: string;
    dni: string;
  }>;
  touched: FormikTouched<{
    documentType: string;
    dni: string;
  }>;
  setFieldValue:Function
}

function FormRow({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col">{children}</div>;
}


export default function FormPage2({
  values,
  errors,
  touched,
  setFieldValue,

}: Props) {
    const [userDNI,setUserDNI]=useState("")

    const {
      data: SISAUser,
      isLoading,
      isError,
      isSuccess,
    } = useGetPractitionerSISADataQuery(userDNI);
    const setSISANameLastName=()=>{
      setFieldValue('name',SISAUser.nombre)
      setFieldValue('lastName',SISAUser.apellido)

    }
    //Setear nombre y apellido del usuario de SISA
    useEffect(()=>{
      if(isSuccess &&SISAUser) setSISANameLastName()
    },[SISAUser]) 
  return (
    <div className="flex flex-col gap-4 mb-4">
      <span className="text-center font-bold text-xl">Buscar en SISA</span>
      <div className="grid grid-cols-[35%_65%] gap-[3px]">
        <FormRow>
          <label className="block text-gray-700">
            Numero de documento <span className="text-[#ff0000]">*</span>
          </label>
          <Field
            type="text"
            name="dni"
            className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1] ${
              errors.dni && touched.dni && "border border-red-500"
            }`}
          />
          <ErrorMessage
            name="dni"
            component="div"
            className="text-red-500 text-sm"
          />
        </FormRow>
        {userDNI &&
        <FormRow>
          <Field
            as="select"
            name="license"
            className={`border border-[#A4D4D4] p-2.5 rounded-lg w-full bg-[#F1F1F1]`}
          >
            <option value="">Seleccione una Matricula</option>
            {isLoading && <option value="">Cargando...</option>}
            {isError && <option value="">No se pudieron encontrar matriculas</option>}
            {isSuccess &&
              SISAUser &&
              SISAUser.matriculasHabilitadas?.map((
                license:{ //Tipado de las matriculas
                matricula:string,
                provincia:string,
                profesion:string,
                estado:string
              }, index:number) => (
                <option key={index} value={license.matricula}>
                  {license.matricula}-{license.profesion}
                </option>
              ))}
          </Field>
          <ErrorMessage
            name="license"
            component="div"
            className="text-red-500 text-sm"
          />
        </FormRow>}
        <button
        type="button"
        className={`btn bg-[#078B8C] text-white`}
        onClick={()=>setUserDNI(values.dni)}>Buscarme en SISA</button>
        
      </div>
    </div>
  );
}