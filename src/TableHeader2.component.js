import React from "react";

const TableHeader2 = ({ size1, size2, text1, text2 }) => {
    return <>
        <th colSpan={size1}>{text1}</th>
        <th colSpan={size2}>{text2}</th>
    </>
}

export default TableHeader2;