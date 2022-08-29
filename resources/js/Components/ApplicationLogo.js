import React from 'react';
import logo from '../../assets/LadyNexus-logo.png';

export default function ApplicationLogo({ className }) {
    return (
        <img src={logo} className={className}></img>
    );
}
