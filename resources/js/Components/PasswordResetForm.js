import { useForm } from '@inertiajs/inertia-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from './Button';
import Input from './Input';
import Label from './Label';
import ValidationErrors from './ValidationErrors';

function PasswordResetForm({ userId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        axios.post(route('change-password'), {
            user_id: userId,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation
        }).then(response => {
            if (response.status == 200) {
                setSuccess(response.data.message)

                setTimeout(() => {
                    setSuccess(false)
                }, 5000);
            }
        }).catch(e => {
            if (e.response) {
                setError(e.response.data.message)
            }

            setTimeout(() => {
                setError(false)
            }, 5000);
        })
    };

    return (
        <div className='text-center w-11/12 my-2'>
            <ValidationErrors errors={errors} />

            <form onSubmit={submit}>
                <div>
                    <Label forInput="email" value="Email" />

                    <Input
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password" value="Password" />

                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password_confirmation" value="Confirm Password" />

                    <Input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="md:flex md:items-center md:justify-end mt-4">
                    <Button className="ml-4" processing={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>

            {success &&
                <p className='bg-sage text-white mt-2 w-fit p-2 rounded-lg'>{success}</p>
            }

            {error &&
                <p className='bg-red-500/75 text-white mt-2 w-fit p-2 rounded-lg'>{error}</p>
            }
         </div>
    )
}

export default PasswordResetForm
