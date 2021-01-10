import React from "react";

const TableRow = ({ item, ids, count }) => {

    const drawItems = ({ item, ids, count }) => {

        const elements = [];

        let ind = 0;

        for(const i of ids){

            if(ind === 0){
                //elements.push(new Date(item["1"]).toLocaleString().slice(12, 17))
                //elements.push(item["1"])
                elements.push(item["1"].split('T')[1])
            }
            else if(!i){

                let empty = null
                elements.push(empty)

            } else{
                let full = item[i]
                elements.push(full)

            }

            ind++;

        }

        return(
            elements.length && elements.map((item, index) => item ? index === 0 ? <td className="sticky-col">{item}</td> : <td>{item}</td> : <td></td>)
        )

    }

    return(
        count === 7 ? <tr className="columnWidth yellowRow">

            { drawItems({ item , ids } ) }

        </tr> : <tr className="columnWidth">

            { drawItems({ item , ids } ) }

        </tr>
    )
}

export default TableRow;