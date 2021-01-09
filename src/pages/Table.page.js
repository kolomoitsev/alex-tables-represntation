import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd'
import * as _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import TableRow from "../TableRow.component";

const TablePage = () => {

    const [filterDate, setFilterDate] = useState(null);

    const [diffData, setDiffData] = useState([])

    const [loaded, setLoaded] = useState(false);
    const [currentQuery, setCurrentQuery] = useState(1);
    const [dataAllPoints, setDataAllPoints] = useState([]);
    const [concatData, setConcatData] = useState([]);
    const [readyRows, setReadyRows] = useState([])

    useEffect(() => {

        const points = _.rangeRight(101, 208, 1).reverse()

        let allData = [];

        setDataAllPoints([])
        setConcatData([])
        setReadyRows([])

        const getPointsData = async () => {

            await setLoaded(false)

            let i = 1;

            let dateNow = new Date(Date.now()).toISOString().slice(0, 10);

            await setDataAllPoints([]);

            for(const item of points){

                const url_filter = `https://oask-gtp-web-api2.herokuapp.com/pointvalues/${item}?start=${filterDate} 01:00:00&end=${dateNow} 01:00:00`;

                const url_default = `https://oask-gtp-web-api2.herokuapp.com/pointvalues/${item}?start=${dateNow} 01:00:00&end=${dateNow} 23:00:00`

                await axios.get(filterDate ? url_filter : url_default)
                    .then(res => {

                        if(res.data.values.length){
                            allData.push(res.data)
                        }

                    })
                    .catch(err => console.log(err))

                i++;

                await setCurrentQuery(`${parseInt((i * 100)/points.length)}%`)

            }

            await setDataAllPoints(allData);

            await setLoaded(true)

        }

        getPointsData()

    }, [filterDate])

    useEffect(() => {


        if(dataAllPoints.length){

            let result = [];

            dataAllPoints.forEach(response => {

                response.values.forEach(value => {
                    value['id'] = response._id;
                    result.push(value);
                });

            });

            const concat_sorted = result.sort((a,b) => (a.current_time > b.current_time) ? 1 : ((b.current_time > a.current_time) ? -1 : 0));

            setConcatData(concat_sorted)

        }

    }, [dataAllPoints, setDataAllPoints])

    useEffect(() => {

        if(concatData.length){

            let result = [];
            let obj;

            let current_time;

            for (let i = 0; i < concatData.length; i++) {

                const value = concatData[i];

                if (current_time !== value.str_current_time) {
                    if (obj) result.push(obj);

                    current_time = value.str_current_time;
                    obj = {};
                    obj['1'] = current_time;
                }
                obj[value.id] = value.str_value;
            }

            if (obj) result.push(obj);

            result.length && setReadyRows(result);

        }

    }, [concatData, setConcatData])

    const onChange = (date, dateString) => {

        setFilterDate(dateString);

    }

    return (
        <>
            { !loaded && <div className="showLoader">
                    <div className="loaderWrapper">
                        <i className='bx bx-loader-alt bx-spin bx-flip-vertical'> </i>
                        <p>{ currentQuery }</p>
                    </div>
                </div> }

            { loaded && <div className="App">

                <div className="datePicker">
                    <h2>Select date</h2>
                    <DatePicker defaultValue={ moment() } format={'YYYY/MM/DD'} onChange={onChange} />
                </div>

                <table border="1">

                    <tr>
                        <th className="sticky-col" rowSpan={4}>Година</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                        <th colSpan={7}>ПСГ Богородчани</th>

                    </tr>

                    <tr>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>

                        <th colSpan={5}>ДКС Богородчани</th>
                        <th colSpan={2}>ПСГ</th>


                    </tr>

                    <tr>
                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>


                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>

                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>


                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>

                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>


                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>

                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>


                        <th colSpan={2}>ГПА Ц-6</th>
                        <th colSpan={2}>6</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th colSpan={1}>100</th>

                    </tr>

                    <tr>
                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>

                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>

                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>

                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>

                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>

                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>


                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>

                        <th>Pвх</th>
                        <th>Pвих</th>
                        <th>Є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб.</th>
                        <th>с.рб.</th>

                    </tr>

                    {
                        readyRows && readyRows.map(item => <TableRow item={item} />)
                    }

                    {/*{*/}
                    {/*    diffData.map(item => item.flag === 'values' ?*/}

                    {/*        <tr className="columnWidth" key={item.key}>*/}

                    {/*            <td className="sticky-col" >{new Date(item.date1).toLocaleString().slice(12, 17)}</td>*/}
                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}


                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}

                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}

                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}


                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}

                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}


                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}

                    {/*            <td>{item.ent}</td>*/}
                    {/*            <td>{item.out}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.diff}</td>*/}
                    {/*            <td className="colorDarkPurple">{item.gpa}</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td className="colorPurple">{item.q}</td>*/}
                    {/*            <td>{item.amount}</td>*/}

                    {/*        </tr> :*/}
                    {/*        <tr className="columnWidth avgRow" key={item.key}>*/}
                    {/*            <td className="sticky-col">K:{item.date}</td>*/}
                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}

                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}

                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}

                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}

                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}

                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}

                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}

                    {/*            <td>{item.avgEn}</td>*/}
                    {/*            <td>{item.avgOu}</td>*/}
                    {/*            <td>{Math.fround(item.avgE).toFixed(1) }</td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td> </td>*/}
                    {/*            <td>{item.avgQ}</td>*/}
                    {/*            <td>{item.avgA}</td>*/}



                    {/*        </tr>)*/}
                    {/*}*/}



                </table>



            </div> }
        </>
    )
}


export default TablePage;