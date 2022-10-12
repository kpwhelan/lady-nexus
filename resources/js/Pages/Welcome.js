import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import LandingPageHeaderBar from '@/Components/LandingPageHeaderBar';
import imagewomen from '../../assets/landing-page-women.png';


export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome" />
            <LandingPageHeaderBar />
            <div className='p-4 md:flex justify-center items-center'>
                <img src={imagewomen} className="w-100 md:w-6/12 max-h-1/5"></img>
                <div className="w-96 h-96 text-xl mt-5 ml-2 border-l-4 border-sage pl-3 pt-12 md:flex-row justify-center">
                    <p className='mb-3'>Lady Nexus is an invite only platform built for connecting women.</p>
                    <p className='mb-3'>If you haven't received an invitation yet, ask around to see if you know someone who is a member.</p>
                    <p className='mb-3'>Once you're a member yourself, invite as many as you can or would like to help grow this amazing community.</p>
                    <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                        Already a member?
                    </Link>
                </div>
            </div>
        </>
    );
}
