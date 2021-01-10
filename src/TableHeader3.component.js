import React from "react";

const TableHeader3 = ({ size1, size2, size3, size4, text1, text2, text3, text4 }) => {
    return (
        <>
            <th colSpan={size1}>{text1}</th>
            <th colSpan={size2}>{text2}</th>
            <th colSpan={size3}>{text3}</th>
            <th colSpan={size4}>{text4}</th>
        </>
    )
}

export default TableHeader3;