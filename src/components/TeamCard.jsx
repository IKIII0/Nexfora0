// src/components/TeamCard.jsx

import React from "react";

const TeamCard = ({ name, role, photo, description }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:bg-gray-800/60 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col items-center text-center">
      {/* Photo */}
      <div className="w-32 h-32 min-w-32 min-h-32 max-w-10 max-h-32 mb-4 rounded-full overflow-hidden border-4 border-blue-500/30 hover:border-blue-400 transition-all duration-300 shrink-0">
        <img
          src={photo}
          alt={name}
          className="w-32 h-32 object-cover object-center"
        />
      </div>

      {/* Name */}
      <h4 className="text-2xl font-semibold mb-2">{name}</h4>

      {/* Role */}
      <p className="text-blue-400 font-medium mb-3">{role}</p>

      {/* Description */}
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export default TeamCard;
