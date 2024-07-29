// src/components/Common/Input.js

const Input = ({ field }) => {
  return (
    <div className="mb-3">
      <label
        className="block text-sm  dark:text-white text-black font-bold mb-2"
        htmlFor={field.name}
      >
        {field.placeholder}
      </label>
      <input
        className="shadow border rounded w-full py-2 px-3hite leading-tight focus:outline-none focus:shadow-outline"
        id={field.name}
        type={field.type}
        placeholder={field.placeholder}
        value={field.value}
        onChange={field.onChange}
        required={field.req}
        disabled={field.disabled || false}
      />
    </div>
  );
};

export default Input;
