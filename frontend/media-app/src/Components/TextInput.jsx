import React from 'react'

function TextInput({ type, placeholder, styles, label, labelStyles, register, name, error, defaultValue, ref }) {
  return (
    <div className="w-full flex flex-col mt-2">
      {label && (<p className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}>{label}</p>)}
      <div>
        <input type={type} name={name} placeholder={placeholder} defaultValue={defaultValue} ref={ref} className={`bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 placeholder:text-[#666] ${styles}`} {...register} aria-invalid={error ? "true" : "false"} />
        {error && <span className="text-xs text-[#f64949fe] mt-0.5">{error}</span>}
      </div>
    </div>
  )
}

export default TextInput;
