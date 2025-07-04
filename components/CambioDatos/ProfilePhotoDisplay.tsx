import React from "react";

type ProfilePhotoDisplayProps = {
  photo: string | null;
  editable: boolean;
  onChangePhotoClick?: () => void;
};

const ProfilePhotoDisplay: React.FC<ProfilePhotoDisplayProps> = ({
  photo,
  editable,
  onChangePhotoClick,
}) => {
  return (
    <div className={`w-full flex flex-col ${editable ? "items-center" : "items-start"}`}>
      {/* Contenedor de la foto de perfil */}
      <div className="relative w-[85px] h-[85px]">
        <div className="w-full h-full rounded-full overflow-hidden border-1 border-black">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-sm text-gray-500">Foto</span>
            </div>
          )}
        </div>
      </div>

      {/* Botón Cambiar foto */}
      {editable && (
        <button
          onClick={onChangePhotoClick}
          className="mt-3 mb-2 text-[#078B8C] border border-[#078B8C] rounded-lg py-1 px-3 bg-transparent hover:bg-[#078B8C] hover:text-white transition-colors"
        >
          Cambiar foto
        </button>
      )}
    </div>
  );
};

export default ProfilePhotoDisplay;