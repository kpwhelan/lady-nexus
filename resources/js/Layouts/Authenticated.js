import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/inertia-react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PostForm from '@/Components/PostForm';

export default function Authenticated({ auth, header, children}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [displayPostForm, setDisplayPostForm] = useState(false);

    const toggleSetDisplayPostForm = () => {
        if (displayPostForm) {
            setDisplayPostForm(false)
        } else if (!displayPostForm) {
            setDisplayPostForm(true)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100 p-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/nexus">
                                    <ApplicationLogo className="block h-16 w-auto rounded-full" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Nexus
                                </NavLink>
                                <NavLink href={route('my-posts')} active={route().current('my-posts')}>
                                    My Posts
                                </NavLink>
                                <NavLink href={route('my-likes')} active={route().current('my-likes')}>
                                    My Likes
                                </NavLink>
                                <NavLink href={route('get-my-follow-posts-page')} active={route().current('get-my-follow-posts-page')}>
                                    My Follows
                                </NavLink>
                                <NavLink href={route('invite')} active={route().current('invite')}>
                                    Invite
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.first_name} {auth.user.last_name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('my-account')} method="get" as="button">
                                            My Account
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            {!displayPostForm &&
                                <div onClick={toggleSetDisplayPostForm} className="border-solid border-sage border-2 rounded-full md:hidden w-fit py-2 px-3 mx-1 bg-white">
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                            }

                            {displayPostForm &&
                                <div onClick={toggleSetDisplayPostForm} className="border-solid border-sage border-2 rounded-full md:hidden w-fit py-2 px-3 mx-1 bg-white">
                                    <FontAwesomeIcon icon={faX} />
                                </div>
                            }


                            {displayPostForm &&
                                <div className='bg-sage/[0.6] fixed z-30 right-2 left-2 top-20 bottom-2'>
                                    <PostForm />
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Nexus
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('my-posts')} active={route().current('my-posts')}>
                            My Posts
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('my-likes')} active={route().current('my-likes')}>
                            My Likes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('get-my-follow-posts-page')} active={route().current('get-my-follow-posts-page')}>
                            My Follows
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('invite')} active={route().current('invite')}>
                            Invite
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{auth.user.username}</div>
                        </div>

                        <div className='mt-3 space-y-1'>
                            <ResponsiveNavLink href={route('my-account')} method="get" as="button" >
                                My Account
                            </ResponsiveNavLink>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
