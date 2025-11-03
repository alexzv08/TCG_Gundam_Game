// import React from 'react';
import { useState } from 'react';
import icon from '../assets/svg/bolt-svgrepo-com.svg';
import NavBar from '../organisms/sidebar/Sidebar copy';
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
            title: "Deck Builder",
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

        <NavBar></NavBar>

    );
};



export default Sidebar;
