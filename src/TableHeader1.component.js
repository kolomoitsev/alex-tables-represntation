import React from "react";

const TableHeader1 = ({ spanSize, text }) => {
    return <th colSpan={spanSize}>{ text }</th>
}

export default TableHeader1;