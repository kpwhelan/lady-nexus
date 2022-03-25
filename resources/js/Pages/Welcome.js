import React from 'react';
import { Head } from '@inertiajs/inertia-react';
import LandingPageHeaderBar from '@/Components/LandingPageHeaderBar';
import RegistrationForm from '@/Components/RegistrationForm';
import imagewomen from '../../assets/landing-page-women.png';


export default function Welcome(props) {
    return (
        <>
            <Head title="LadyNexus" />
            <LandingPageHeaderBar />
            <div className='p-4 flex justify-center'>
                <img src={imagewomen} className="w-6/12 max-h-1/5"></img>
                <RegistrationForm />
            </div>
        </>
    );
}
