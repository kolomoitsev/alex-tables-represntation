import React, {useEffect, useState} from 'react';
import {DatePicker} from 'antd'
import axios from 'axios';

import TableRow from "../TableRow.component";

import moment from 'moment'

const points = [null, null, null, 155, 139, null,
    196, null, 113, 170, 156, 140, null, 197, 101, 102, null,
    198, null, 114, 171, 157, 141, null, 199, null, 115, 172,
    152, 141, null, 200, null, 116, 173, 103, 117, 104, 118,
    159, 143, null, 201, 160, 144, null, 202,
    161, 145, null, 203, 162, 146, null, 204, 163, 147, null, 205,
    null, null, null, 105, null, 119, 174, 106, null, 120, 175, 107, null,
    121, 176, 108, null, 122, 177, 151, 135, null, 192, 152, 136, null, 193,
    null, 110, 167, 153, 137, null, 194, null, 111, 168, 154, 138, null,
    195, null, 112, 169, 164, 148, null, 206, null, 123, 178, 165,
    149, null, 207, null, 124, 179, 166, 150, null, 208, null, 125, 180]

const TablePage = () => {

    const [filterDate, setFilterDate] = useState(null);

    const [loaded, setLoaded] = useState(false);
    const [currentQuery, setCurrentQuery] = useState(1);
    const [dataAllPoints, setDataAllPoints] = useState([]);
    const [concatData, setConcatData] = useState([]);
    const [readyRows, setReadyRows] = useState([])
    
    useEffect(() => {


        let allData = [];

        setDataAllPoints([])
        setConcatData([])
        setReadyRows([])

        const getPointsData = async () => {

            await setLoaded(false)

            let i = 1;

            let dateNow = new Date(Date.now()).toISOString().slice(0, 10);

            await setDataAllPoints([]);

            for (const item of points) {

                if (item) {

                    const nextDay = moment(new Date(filterDate)).add(1, 'days').format('YYYY-MM-DD')

                    const url_filter = `https://oask-gtp-web-api2.herokuapp.com/pointvalues/${item}?start=${filterDate} 00:00:00&end=${nextDay} 00:00:00`;

                    const url_default = `https://oask-gtp-web-api2.herokuapp.com/pointvalues/${item}?start=${dateNow} 00:00:00&end=${dateNow} 23:00:00`

                    await axios.get(filterDate ? url_filter : url_default)
                        .then(res => {

                            if (res.data.values.length) {
                                allData.push(res.data)
                            }

                        })
                        .catch(err => console.log(err))

                    // console.log({ filterDate, nextDay})

                }



                i++;

                await setCurrentQuery(`${parseInt((i * 100) / points.length)}%`)

            }

            await setDataAllPoints(allData);

            await setLoaded(true)

        }

        getPointsData()

    }, [filterDate])

    useEffect(() => {


        if (dataAllPoints.length) {

            let result = [];

            dataAllPoints.forEach(response => {

                response.values.forEach(value => {
                    value['id'] = response._id;
                    result.push(value);
                });

            });

            const concat_sorted = result.sort((a, b) => (a.current_time > b.current_time) ? 1 : ((b.current_time > a.current_time) ? -1 : 0));

            setConcatData(concat_sorted)

        }

    }, [dataAllPoints, setDataAllPoints])

    useEffect(() => {

        if (concatData.length) {

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

            //result.length && console.log(result)

            result.length && setReadyRows(result);

        }

    }, [concatData, setConcatData])

    const onChange = (date, dateString) => {

        setFilterDate(dateString);

    }

    return (
        <>
            {!loaded && <div className="showLoader">
                <div className="loaderWrapper">
                    <i className='bx bx-loader-alt bx-spin bx-flip-vertical'> </i>
                    <p>{currentQuery}</p>
                </div>
            </div>}

            {loaded && <div className="App">

                <div className="datePickerBlock">
                    <div className="datePicker">
                        <h2>Select date</h2>
                        <DatePicker
                            defaultValue={!filterDate ? moment() : moment(filterDate.split('/').join('-'), 'YYYY-MM-DD') }
                            format={'YYYY-MM-DD'}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <table>
                    <tr>
                        <th className="sticky-col" rowSpan={4}>
                            Година
                        </th>
                        <th colSpan={2}> ОГСУ,усього</th>
                        <th colSpan={7}> ПСГ Богородчани</th>
                        <th colSpan={11}> ПСГ Опарське</th>
                        <th colSpan={7}> ПСГ Дашавське</th>
                        <th colSpan={7}> ПСГ Угерське</th>
                        <th colSpan={43}> ПСГ Більче-Волиця</th>
                        <th colSpan={11}> ПСГ Мринське</th>
                        <th colSpan={7}> ПСГ Солоха</th>
                        <th colSpan={7}> ПСГ Олишівка</th>
                        <th colSpan={7}> ПСГ Пролетарське</th>
                        <th colSpan={7}> ПСГ Кегичівське</th>
                        <th colSpan={7}> ПСГ Краснопопівське</th>
                    </tr>

                    <tr>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th colSpan={4}>ДКС Богородчани</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС-1</th>
                        <th colSpan={4}>ДКС-2</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ВОГ Більче-Волиця</th>
                        <th colSpan={4}>КЦ1</th>
                        <th colSpan={4}>КЦ1А</th>
                        <th colSpan={4}>КЦ2</th>
                        <th colSpan={4}>КЦ3</th>
                        <th colSpan={4}>КЦ4</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ГЗП-1</th>
                        <th colSpan={4}>ГЗП-2</th>
                        <th colSpan={4}>ГЗП-3</th>
                        <th colSpan={4}>ГЗП-4</th>
                        <th colSpan={4}>КС-5 Бобровницька</th>
                        <th colSpan={4}>ДКС-Мрин</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС Солоха</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС Олишівка</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС Пролетарка</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС Кегичівка</th>
                        <th colSpan={3}>ПСГ</th>
                        <th colSpan={4}>ДКС Краснопопівка</th>
                        <th colSpan={3}>ПСГ</th>
                    </tr>

                    <tr>
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>&nbsp;</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>&nbsp;</th>
                        <th colSpan={2} className="xl654306">К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={2}>1200</th>
                        <th colSpan={2}>1400</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>&nbsp;</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>&nbsp;</th>
                        <th>К-сть свер<span className='d-n'>дловин</span></th>
                        <th>&nbsp;</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                        <th colSpan={3}>МК-8М</th>
                        <th>ххх</th>
                        <th colSpan={2}>К-сть свердловин</th>
                        <th>ххх</th>
                    </tr>


                    <tr>
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>P</th>
                        <th>Q</th>
                        <th>P</th>
                        <th>Q</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвих</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвих</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвих</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвих</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                        <th>Рвх</th>
                        <th>Рвих</th>
                        <th>є</th>
                        <th>ГПА</th>
                        <th>Q зак.</th>
                        <th>Q відб</th>
                        <th>с.роб</th>
                    </tr>


                    <tr className="greyRow">
                        <td className="sticky-col">1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                        <td>10</td>
                        <td>11</td>
                        <td>12</td>
                        <td>13</td>
                        <td>14</td>
                        <td>15</td>
                        <td>16</td>
                        <td>17</td>
                        <td>18</td>
                        <td>19</td>
                        <td>20</td>
                        <td>21</td>
                        <td>22</td>
                        <td>23</td>
                        <td>24</td>
                        <td>25</td>
                        <td>26</td>
                        <td>27</td>
                        <td>28</td>
                        <td>29</td>
                        <td>30</td>
                        <td>31</td>
                        <td>32</td>
                        <td>33</td>
                        <td>34</td>
                        <td>35</td>
                        <td>36</td>
                        <td>37</td>
                        <td>38</td>
                        <td>39</td>
                        <td>40</td>
                        <td>41</td>
                        <td>42</td>
                        <td>43</td>
                        <td>44</td>
                        <td>45</td>
                        <td>46</td>
                        <td>47</td>
                        <td>48</td>
                        <td>49</td>
                        <td>50</td>
                        <td>51</td>
                        <td>52</td>
                        <td>53</td>
                        <td>54</td>
                        <td>55</td>
                        <td>56</td>
                        <td>57</td>
                        <td>58</td>
                        <td>59</td>
                        <td>60</td>
                        <td>61</td>
                        <td>62</td>
                        <td>63</td>
                        <td>64</td>
                        <td>65</td>
                        <td>66</td>
                        <td>67</td>
                        <td>68</td>
                        <td>69</td>
                        <td>70</td>
                        <td>71</td>
                        <td>72</td>
                        <td>73</td>
                        <td>74</td>
                        <td>75</td>
                        <td>76</td>
                        <td>77</td>
                        <td>78</td>
                        <td>79</td>
                        <td>80</td>
                        <td>81</td>
                        <td>82</td>
                        <td>83</td>
                        <td>84</td>
                        <td>85</td>
                        <td>86</td>
                        <td>87</td>
                        <td>88</td>
                        <td>89</td>
                        <td>90</td>
                        <td>91</td>
                        <td>92</td>
                        <td>93</td>
                        <td>94</td>
                        <td>95</td>
                        <td>96</td>
                        <td>97</td>
                        <td>98</td>
                        <td>99</td>
                        <td>100</td>
                        <td>101</td>
                        <td>102</td>
                        <td>103</td>
                        <td>104</td>
                        <td>105</td>
                        <td>106</td>
                        <td>107</td>
                        <td>108</td>
                        <td>109</td>
                        <td>110</td>
                        <td>111</td>
                        <td>112</td>
                        <td>113</td>
                        <td>114</td>
                        <td>115</td>
                        <td>116</td>
                        <td>117</td>
                        <td>118</td>
                        <td>119</td>
                        <td>120</td>
                        <td>121</td>
                        <td>122</td>
                        <td>123</td>
                        <td>124</td>
                    </tr>

                    <tr className="greyRow">
                        <td className="sticky-col">&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>155</td>
                        <td>139</td>
                        <td>&nbsp;</td>
                        <td>196</td>
                        <td>&nbsp;</td>
                        <td>113</td>
                        <td>170</td>
                        <td>156</td>
                        <td>140</td>
                        <td>&nbsp;</td>
                        <td>197</td>
                        <td>101</td>
                        <td>102</td>
                        <td>&nbsp;</td>
                        <td>198</td>
                        <td>&nbsp;</td>
                        <td>114</td>
                        <td>171</td>
                        <td>157</td>
                        <td>141</td>
                        <td>&nbsp;</td>
                        <td>199</td>
                        <td>&nbsp;</td>
                        <td>115</td>
                        <td>172</td>
                        <td>152</td>
                        <td>141</td>
                        <td>&nbsp;</td>
                        <td>200</td>
                        <td>&nbsp;</td>
                        <td>116</td>
                        <td>173</td>
                        <td>103</td>
                        <td>117</td>
                        <td>104</td>
                        <td>118</td>
                        <td>159</td>
                        <td>143</td>
                        <td>&nbsp;</td>
                        <td>201</td>
                        <td>160</td>
                        <td>144</td>
                        <td>&nbsp;</td>
                        <td>202</td>
                        <td>161</td>
                        <td>145</td>
                        <td>&nbsp;</td>
                        <td>203</td>
                        <td>162</td>
                        <td>146</td>
                        <td>&nbsp;</td>
                        <td>204</td>
                        <td>163</td>
                        <td>147</td>
                        <td>&nbsp;</td>
                        <td>205</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>105</td>
                        <td>&nbsp;</td>
                        <td>119</td>
                        <td>174</td>
                        <td>106</td>
                        <td>&nbsp;</td>
                        <td>120</td>
                        <td>175</td>
                        <td>107</td>
                        <td>&nbsp;</td>
                        <td>121</td>
                        <td>176</td>
                        <td>108</td>
                        <td>&nbsp;</td>
                        <td>122</td>
                        <td>177</td>
                        <td>151</td>
                        <td>135</td>
                        <td>&nbsp;</td>
                        <td>192</td>
                        <td>152</td>
                        <td>136</td>
                        <td>&nbsp;</td>
                        <td>193</td>
                        <td>&nbsp;</td>
                        <td>110</td>
                        <td>167</td>
                        <td>153</td>
                        <td>137</td>
                        <td>&nbsp;</td>
                        <td>194</td>
                        <td>&nbsp;</td>
                        <td>111</td>
                        <td>168</td>
                        <td>154</td>
                        <td>138</td>
                        <td>&nbsp;</td>
                        <td>195</td>
                        <td>&nbsp;</td>
                        <td>112</td>
                        <td>169</td>
                        <td>164</td>
                        <td>148</td>
                        <td>&nbsp;</td>
                        <td>206</td>
                        <td>&nbsp;</td>
                        <td>123</td>
                        <td>178</td>
                        <td>165</td>
                        <td>149</td>
                        <td>&nbsp;</td>
                        <td>207</td>
                        <td>&nbsp;</td>
                        <td>124</td>
                        <td>179</td>
                        <td>166</td>
                        <td>150</td>
                        <td>&nbsp;</td>
                        <td>208</td>
                        <td>&nbsp;</td>
                        <td>125</td>
                        <td>180</td>
                    </tr>

                    { readyRows && readyRows.map((item, index) => <TableRow item={item} ids={points} count={index}/>) }

                </table>

            </div>}
        </>
    )
}


export default TablePage;