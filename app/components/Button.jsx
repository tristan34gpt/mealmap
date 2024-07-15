function Button({ children, className, type = "button" }) {
  return (
    <button
      type={type}
      className={`bg-primary-700 rounded-lg hover:bg-primary-500 transition-all text-white ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
