// import React from 'react';
import { useState } from 'react';
import icon from '../../assets/react.svg';

const Sidebar = () => {

    const [open, setOpen] = useState(false);
    const Menus =   
    [
        {
            icon: icon,
            title: "Home",
            link: "/home",
        },  
        {
            icon: icon,
            title: "Deck",
            link: "/deck"
        },
        {
            icon: icon,
            title: "Game",
            link: "/game"
        },
        {
            icon: icon,
            title: "Profile",
            link: "/profile"
        }
    ]

    return (

            <div className={`${open ? "w-72" : "w-20"} duration-300 h-screen bg-white relative p-5 pt-8`}>
                <img src={icon} alt="" 
                    className={`absolute border-2 bg-black border-black rounded-full 
                        cursor-pointer -right-3.5 top-9 w-7 h-7 ${!open && "right-15 && rotate-180"}`}
                    onClick={() => setOpen(!open)}
                    />
                <div className="flex items-center gap-x-4 pointer-cursor">
                <img src={icon} alt="" 
                    className={` cursor-pointer duration-500`}
                    />
                    <h1 className={`text-black origin-left font-medium text-xl duration-300
                        ${!open && "scale-0"}`}>TCG Gundam</h1>
                </div>
                <ul className='pt-10'>
                    {Menus.map((menu, index) => (
                        <li key={index} className={`flex items-center p-2 text-lg text-gray-500 cursor-pointer gap-x-4
                        hover:bg-gray-400 rounded-md
                        ${menu.gap ? "mt-9" : "mt-2"}`}
                        >
                            <img src={icon} alt={`icon ${menu.title}`} className='w-15 h-15' />
                            <span className={`${!open && "hidden"} origin-left duration-200`}>{menu.title}</span>
                        </li>
                        
                    ))}
                </ul>
            </div>

    );
};



export default Sidebar;
