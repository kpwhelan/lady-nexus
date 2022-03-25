import React from 'react';
import TransparentLogo from '../../assets/LadyNexus-transparent-background.png';

export default function LandingPageHeaderBar() {
    return (
        <div className='p-4'>
            <div className='bg-sage w-4/5 rounded-xl'>
                <img src={TransparentLogo} className='w-80 h-50 rounded-full'></img>
            </div>
        </div>
    );
}
