// import React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import icon from '../../assets/react.svg';
import userIcon from '../../assets/svg/user.svg'
import game from '../../assets/svg/game.svg'
import deck from '../../assets/svg/stack.svg'
import home from '../../assets/svg/home.svg'

const Sidebar = () => {

    const [open, setOpen] = useState(false);
    const location = useLocation();
    const Menus =   
    [
        {
            icon: home,
            title: "Home",
            link: "/home",
        },  
        {
            icon: deck,
            title: "Deck",
            link: "/deck"
        },
        {
            icon: game,
            title: "Game",
            link: "/game"
        },
        {
            icon: userIcon,
            title: "Profile",
            link: "/profile"
        }
    ]

    return (



            <div className={`${open ? "w-72" : "w-20"} duration-300 h-screen bg-[var(--bg-primary)] relative pt-8`}>
                {/* Hamburger Icon */}
                <div 
                    className='flex flex-col bg-black h-[30px] w-[30px] justify-center items-center border-2 border-white rounded-md gap-y-2 cursor-pointer absolute -right-5 top-[4%]'
                    onClick={() => setOpen(!open)}
                >
                    <div className={`bg-white w-3/4 h-1 transition-all duration-300 ease-in-out ${open ? 'rotate-45 absolute' : ''}`}></div>
                    <div className={`bg-white w-3/4 h-1 transition-all duration-300 ease-in-out ${open ? 'opacity-0' : 'opacity-100 absolute'}`}></div>
                    <div className={`bg-white w-3/4 h-1 transition-all duration-300 ease-in-out ${open ? 'rotate-135 absolute' : ''}`}></div>
                </div>
                <div className="flex items-center pl-2 gap-x-4 pointer-cursor">
                    <img src={icon} alt="" 
                        className={` cursor-pointer duration-500`}
                    />
                    <h1 className={`text-black origin-left font-medium text-xl duration-300
                        ${!open && "scale-0"}`}>TCG Gundam
                    </h1>
                </div>
                <ul className='pt-10'>
                    {Menus.map((menu, index) => (
                        <Link to={menu.link} key={index}>
                            <li className={`flex items-center gap-3 p-5 pl-2 w-full cursor-pointer
                            ${location.pathname === menu.link 
                                ? "bg-gradient-to-r from-[var(--accent-orange-glow)] to-transparent text-[var(--accent-orange)] border-r-4 border-[var(--accent-orange)]" 
                                : "text-gray-300 hover:bg-gray-700"
                            }
                            ${menu.gap ? "mt-9" : "mt-2"}`}
                            >
                                <img src={menu.icon} alt={`icon ${menu.title}`} className='w-8 h-8 text-white color-red-500' />
                                <span className={`${!open && "hidden"} origin-left duration-200`}>{menu.title}</span>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>

    );
};



export default Sidebar;
