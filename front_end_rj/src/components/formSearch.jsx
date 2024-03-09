/* eslint-disable react/jsx-pascal-case */

import React from 'react';
import { SVG_ri_search_line } from '~/assets/SVG';

function FormSearch({ placeHolder }) {
    return (
        <form className="flex items-center bg-fifth-color py-3 px-4 rounded-sm mt-4">
            <SVG_ri_search_line height={18} width={18} />
            <input
                type="text"
                name=""
                id=""
                className="flex-1 bg-transparent outline-none ml-5 text-black text-sm"
                placeholder={placeHolder}
            />
        </form>
    );
}

export default FormSearch;
