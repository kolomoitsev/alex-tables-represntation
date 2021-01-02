import React, {useEffect, useState} from 'react';
import axios from 'axios';


const TablePage = () => {

    const [entryData, setEntryData] = useState(null)
    const [outerData, setOuterData] = useState(null)
    const [gpaData, setGPAData] = useState(null)
    const [qData, setQData] = useState(null)
    const [amountData, setAmountData] = useState(null)

    const [fullName, setFullName] = useState(null)
    const [smallName, setSmallName] = useState(null)

    const [diffData, setDiffData] = useState([])

    useEffect(() => {

        const getEntryData = async () => {

            const {data} = await axios.get('https://oask-gtp-web-api2.herokuapp.com/pointvalues/100?start=2021-01-01 01:00:00&end=2021-01-02 01:00:00')
                .catch(e => console.log(e))

            data && await setFullName(data.full_name)
            data && await setSmallName(data.name)
            data && await setEntryData(data.values)

        }

        const getOuterData = async () => {

            const {data} = await axios.get('https://oask-gtp-web-api2.herokuapp.com/pointvalues/101?start=2021-01-01 01:00:00&end=2021-01-02 01:00:00')
                .catch(e => console.log(e))

            data && await setOuterData(data.values)

        }

        const getGPA = async () => {
            const {data} = await axios.get('https://oask-gtp-web-api2.herokuapp.com/pointvalues/102?start=2021-01-01 01:00:00&end=2021-01-02 01:00:00')
                .catch(e => console.log(e))
            data && await setGPAData(data.values)

        }

        const getQData = async () => {
            const {data} = await axios.get('https://oask-gtp-web-api2.herokuapp.com/pointvalues/106?start=2021-01-01 01:00:00&end=2021-01-02 01:00:00')
                .catch(e => console.log(e))

            data && await setQData(data.values)

        }

        const getAmountData = async () => {

            const {data} = await axios.get('https://oask-gtp-web-api2.herokuapp.com/pointvalues/107?start=2021-01-01 01:00:00&end=2021-01-02 01:00:00')
                .catch(e => console.log(e))

            data && await setAmountData(data.values)

        }

        getEntryData()
        getOuterData()
        getGPA()
        getQData()
        getAmountData()
    }, [])

    useEffect(() => {

        const groupData = async () => {

            let dates = [];

            entryData && entryData.map(item => dates.push(new Date(item.current_time).toLocaleDateString()))

            const uniqueDates = [...new Set(dates)]

            //uniqueDates && console.log(uniqueDates)

            let groupValues = [];

            if (entryData !== null &&
                outerData !== null &&
                gpaData !== null &&
                qData !== null &&
                amountData !== null) {

                //console.log(entryData, outerData, gpaData, qData)

                for (let item of uniqueDates) {

                    let P_entry = 0;
                    let P_outer = 0;
                    let E_value = 0;
                    let Q_value = 0;
                    let I_count = 0;
                    let A_value = 0;

                    let AVG_entry = 0;
                    let AVG_out = 0;
                    let AVG_E = 0;
                    let AVG_Q = 0;
                    let AVG_A = 0;

                    for (let i = 0; i < entryData.length; i++) {

                        if ((new Date(entryData[i].current_time).toLocaleDateString()) === item) {


                            P_entry += entryData[i].num_value
                            P_outer += outerData[i].num_value
                            E_value += outerData[i].num_value / entryData[i].num_value
                            Q_value += qData[i].num_value
                            A_value += amountData[i].num_value
                            I_count++;

                            groupValues.push({
                                flag: 'values',
                                key: entryData[i] && entryData[i]._id,
                                ent: entryData[i] && entryData[i].num_value,
                                out: outerData[i] && outerData[i].num_value,
                                gpa: gpaData[i] && gpaData[i].num_value,
                                q: qData[i] && qData[i].num_value,
                                amount: amountData[i] && amountData[i].num_value,
                                diff: outerData[i] && outerData[i].num_value / entryData[i].num_value,
                                date1: entryData[i] && entryData[i].str_current_time,
                                date2: outerData[i] && outerData[i].str_current_time,
                            })
                        }
                    }

                    AVG_entry = P_entry / I_count;
                    AVG_out = P_outer / I_count;
                    AVG_E = E_value / I_count;
                    AVG_Q = Q_value / I_count;
                    AVG_A = A_value / I_count;

                    let date_format = item.slice(0, 2) + "/" + item.slice(3, 5)

                    groupValues.push({
                        flag: 'avg',
                        date: date_format,
                        avgEn: AVG_entry,
                        avgOu: AVG_out,
                        avgE: AVG_E,
                        avgQ: AVG_Q,
                        avgA: AVG_A
                    })

                }

            }

            groupValues.sort((a, b) => {
                return new Date(a.date1) - new Date(b.date1)
            })

            setDiffData(groupValues)

        }

        groupData()

    }, [entryData, outerData, gpaData, qData, amountData])

    return (


        <div className="App">
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
            <table border="1">
                <tr>
                    {/*<th colSpan={8}>{fullName && fullName}</th>*/}
                    <th colSpan={8}>ПСГ Богородчани</th>
                </tr>

                <tr>
                    {/*<th colSpan={5}>{smallName && smallName}</th>*/}
                    <th colSpan={5}>ДКС Богородчани</th>
                    <th colSpan={3}>ПСГ</th>
                </tr>

                <tr>
                    <th colSpan={3}>ГПА Ц-6</th>
                    <th colSpan={2}>6</th>
                    <th colSpan={2}>К-сть свердловин</th>
                    <th colSpan={1}>100</th>
                </tr>

                <tr>
                    <th>Година</th>
                    <th>Pвх</th>
                    <th>Pвих</th>
                    <th>Є</th>
                    <th>ГПА</th>
                    <th>Q зак.</th>
                    <th>Q відб.</th>
                    <th>с.рб.</th>
                </tr>
                {
                    diffData.map(item => item.flag === 'values' ? <tr className="columnWidth" key={item.key}>
                            <td>{new Date(item.date1).toLocaleString().slice(12, 17)}</td>
                            <td>{item.ent}</td>
                            <td>{item.out}</td>
                            <td className="colorDarkPurple">{item.diff}</td>
                            <td className="colorDarkPurple">{item.gpa}</td>
                            <td> </td>
                            <td className="colorPurple">{item.q}</td>
                            <th>{item.amount}</th>
                        </tr> :
                        <tr className="columnWidth avgRow" key={item.key}>
                            <td>K:{item.date}</td>
                            <td>{item.avgEn}</td>
                            <td>{item.avgOu}</td>
                            <td>{Math.fround(item.avgE).toFixed(1) }</td>
                            <td> </td>
                            <td> </td>
                            <td>{item.avgQ}</td>
                            <th>{item.avgA}</th>
                        </tr>)
                }



            </table>
        </div>
    )
}


export default TablePage;