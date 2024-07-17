import React from "react";

function Input({ placeholder, type, Icon, label, className, inputRef }) {
  return (
    <div className="relative flex flex-col items-start">
      {label && <label className="mb-1 text-gray-700">{label}</label>}
      <div className={`relative flex items-center w-full ${className}`}>
        <input
          className={`bg-[#F9FAFB] border-[1px] rounded-[8px] pl-10 pr-4 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          type={type}
          placeholder={placeholder}
          required
          ref={inputRef}
        />
        <Icon className="absolute left-3 text-gray-500" size={20} />
      </div>
    </div>
  );
}

export default Input;
