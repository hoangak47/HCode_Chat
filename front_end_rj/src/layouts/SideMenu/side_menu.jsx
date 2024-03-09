import React from 'react';
import { SGVLogo } from '~/assets/SVG';
import Navside from '~/components/navside';
import Tabside from '~/components/tabside';

function Side_menu() {
    return (
        <div className="flex lg:flex-col flex-row lg:w-[75px] w-full lg:justify-between justify-around items-center lg:h-full h-[3.5rem] bg-white shadow-xl ">
            <div className="p-5 cursor-pointer lg:inline-block hidden">
                <SGVLogo width={30} height={30} />
            </div>

            <Tabside />

            <Navside />
        </div>
    );
}

export default Side_menu;
