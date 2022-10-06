import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Authenticated from '@/Layouts/Authenticated'
import { Head, useForm } from '@inertiajs/inertia-react';
import React from 'react'

function Invite(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        name: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('send-invite'), {
            onError: error => {
                console.log(error)
            }
        });
    };

  return (
    <Authenticated
        auth={props.auth}
        errors={props.errors}
    >
        <Head title="Invite" />

        <div className="mx-auto text-center max-w-md mt-4">
            <p>Lady Nexus is meant to be a safe, enjoyable place for women to connect with other women.</p>
            <p>Please be mindful of who you invite to our platform.</p>
            <form className='mt-4' onSubmit={submit}>
                <Label forInput="email" value='Send An Invite' className={"text-lg"}/>
                <Input
                    type="text"
                    name="name"
                    value={data.name}
                    className="w-full mb-2"
                    autoComplete="name"
                    isFocused={false}
                    handleChange={onHandleChange}
                    placeholder="Your Name (so they know who it's from!)"
                    required
                />
                <Input
                    type="email"
                    name="email"
                    value={data.invite_email}
                    className="w-full mb-2"
                    autoComplete="email"
                    isFocused={false}
                    handleChange={onHandleChange}
                    placeholder="Email"
                    required
                />

                <Button className="my-1" processing={processing}>
                    Send Invite
                </Button>
            </form>
        </div>
    </Authenticated>
  )
}

export default Invite
