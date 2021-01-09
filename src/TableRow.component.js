import React from "react";

const TableRow = (item) => {

    let items = [];

    if(item.item){
        for (const [key, value] of Object.entries(item.item)) {
            items.push({ key, value })
        }
    }

    return(
        <tr className="columnWidth">
            {
                items.length && items.map((i, index) => index === 0 ?
                    <td className="sticky-col" key={i.key}>
                         { new Date(i.value).toLocaleString().slice(12, 17) }
                    </td> :
                    <td key={i.key}>{i.value}</td> )
            }
        </tr>
    )
}

export default TableRow;