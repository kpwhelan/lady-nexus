import React, { useEffect, useRef } from 'react';

export default function Input({
    type = 'text',
    name,
    value,
    className,
    autoComplete,
    required,
    isFocused,
    handleChange,
    placeholder,
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-start">
            {type === 'textarea' ? (
                <textarea
                name={name}
                value={value}
                className={
                    `border-gray-300 focus:border-sage focus:ring focus:ring-sage focus:ring-opacity-50 rounded-md shadow-sm ` +
                    className
                }
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => handleChange(e)}
                placeholder={placeholder}
                ></textarea>
            ) :
            (<input
                type={type}
                name={name}
                value={value}
                className={
                    `border-gray-300 focus:border-sage focus:ring focus:ring-sage focus:ring-opacity-50 rounded-md shadow-sm ` +
                    className
                }
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => handleChange(e)}
            />)}
        </div>
    );
}
