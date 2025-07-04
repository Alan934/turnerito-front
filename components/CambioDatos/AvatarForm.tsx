import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import ProfilePhotoDisplay from "./ProfilePhotoDisplay";
import { Practitioner, TokenWithEntity } from "@/app/definitions/definitions";
import { useUpdateAvatarMutation } from "@/app/redux/api/practitioner.api";
import Swal from "sweetalert2";
import { Session } from "next-auth";

interface Props {
  practitioner: Practitioner;
  editable: boolean;
  shouldReset?: boolean; // Prop para desencadenar el reset
  onResetComplete?: () => void; // Callback para notificar que el reset está completo
  onDoneEditing: () => void;
}

export default function AvatarForm({ practitioner, editable, shouldReset, onResetComplete, onDoneEditing  }: Props) {
  const { data: session, update } = useSession();
  const [updateAvatar] = useUpdateAvatarMutation();

  const [photo, setPhoto] = useState<string | null>(practitioner.urlImg);
  const [file, setFile] = useState<File | null>(null);
  const [hasNewPhoto, setHasNewPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // States para cámara / action sheet
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [animateSheet, setAnimateSheet] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Función para resetear los estados del avatar
  const resetAvatar = () => {
    setPhoto(practitioner.urlImg);
    setFile(null);
    setHasNewPhoto(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
    setShowActionSheet(false);
    setAnimateSheet(false);
  };

  // useEffect para manejar el reset cuando shouldReset cambia
  useEffect(() => {
    if (shouldReset) {
      resetAvatar();
      if (onResetComplete) {
        onResetComplete(); // Notifica al padre que el reset está completo
      }
    }
  }, [shouldReset, onResetComplete]);

  // Funciones para la selección de foto
  const handleSelectImage = () => {
    fileInputRef.current?.click();
    setShowActionSheet(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Guardamos el archivo para subirlo después
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
        setHasNewPhoto(true); // Indicamos que hay una nueva foto
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        setStream(mediaStream);
        setIsCameraActive(true);
        setShowActionSheet(false);
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Asegúrate de permitir el acceso.");
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current?.play();
    }
  }, [isCameraActive, stream]);

  useEffect(() => {
    if (showActionSheet) {
      setTimeout(() => setAnimateSheet(true), 10);
    } else {
      setAnimateSheet(false);
    }
  }, [showActionSheet]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL("image/png");
        setPhoto(photoData);
        setHasNewPhoto(true); // Indicamos que hay una nueva foto
        // Convertimos la imagen capturada a un archivo
        fetch(photoData)
          .then((res) => res.blob())
          .then((blob) => {
            const capturedFile = new File([blob], "captured_photo.png", {
              type: "image/png",
            });
            setFile(capturedFile); // Guardamos el archivo para subirlo
          });
        setIsCameraActive(false);
        stopCamera();
      }
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  // Mostrar/animar el action sheet
  useEffect(() => {
    if (showActionSheet) setTimeout(() => setAnimateSheet(true), 10);
    else setAnimateSheet(false);
  }, [showActionSheet]);

  const handleSubmit = async () => {
    if (!file || !session) return;

    // Llamada al hosting para subir la imagen
    const formData = new FormData();
    formData.append("image", file);

    const hostRes = await fetch(
      "https://api-full-salud.vercel.app/api/auth/upload",
      {
        method: "POST",
        headers: {Authorization: `Bearer ${session.user.accessToken}`},
        body: formData,
      }
    );

    if (!hostRes.ok) {
      return alert("Error subiendo la imagen al hosting");
    }
    const { url } = await hostRes.json();

    // Cambio del avatar en el backend
    try {
      const practitionerData: Partial<Practitioner> = {
        id: session.user.id,
        urlImg: url,
      };

      const patchData: TokenWithEntity = {
        entity: practitionerData,
        token: session.user.accessToken,
      };

      const result = await updateAvatar(patchData).unwrap();

      if (result) {
        Swal.fire({
          icon: "success",
          title: "¡Avatar actualizado correctamente!",
        });
        const user = {
          id: result.id,
          urlImg: result.urlImg,
        };
        update((session: Session) => ({ ...session, user: user }));
        console.log("Avatar actualizado:", session.user);
        setHasNewPhoto(false); // Ocultamos el botón después de guardar
        onDoneEditing();
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Error al actualizar el Avatar!",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-start w-full max-w-md">
      {/* Contenedor de la foto de perfil */}
      <div className="w-full">
        {/* La foto se muestra siempre; el botón "Cambiar foto" solo se ve en modo edición */}
        <div className="p-3">
          <ProfilePhotoDisplay
            photo={photo}
            editable={editable}
            onChangePhotoClick={() => setShowActionSheet(true)}
          />
        </div>
      </div>

      <div className="w-full flex justify-center">
        {hasNewPhoto && (
          <button
            onClick={handleSubmit}
            className="mb-4 px-2 py-2 bg-[#078B8C] text-white rounded"
          >
            Guardar avatar
          </button>
        )}
      </div>

      {/* Action Sheet para cambiar foto */}
      {showActionSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center">
          {/* Overlay de fondo */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setShowActionSheet(false)}
          />
          {/* Contenedor de acciones con animación */}
          <div
            className={`relative w-full max-w-md bg-white rounded-t-2xl p-4 transform transition-transform duration-300 ${
              animateSheet
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Opción Tomar foto */}
              <button onClick={startCamera} className="w-full py-3 text-center">
                <span className="text-gray-800 text-base font-normal font-['Lato'] leading-snug">
                  Tomar foto
                </span>
              </button>
              {/* Opción Seleccionar foto */}
              <button
                onClick={handleSelectImage}
                className="w-full py-3 text-center"
              >
                <span className="text-gray-800 text-base font-normal font-['Lato'] leading-snug">
                  Seleccionar foto
                </span>
              </button>
              {/* Separador */}
              <div className="w-full border-t border-gray-200"></div>
              {/* Opción Cancelar */}
              <button
                onClick={() => setShowActionSheet(false)}
                className="w-full py-3 text-center"
              >
                <span className="text-neutral-600 text-sm font-normal font-['Lato'] leading-none">
                  Cancelar
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input oculto para seleccionar archivos */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal para la cámara */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-10 flex gap-4">
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={capturePhoto}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Capturar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
