import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './style.scss'
import { getProblemData } from '../../../../_actions/problemAction'
import { useDispatch, useSelector } from 'react-redux';
import { FaBorderNone, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProblemDisplayTable from '../../components/ProblemDisplayTable';
import Loading from '../../../../components/Loading/Loading';
import WrapperLoading from '../../../../components/WrapperLoading';
import TotalProblemsLayout from '../../../../layouts/TotalProblemsLayout';
import Select from 'react-select'

function TotalProblemsPage(props) {

    const [problems, setProblems ] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [resultProblem, setResultProblem] = useState([]);

    const [countDisplayProblem, setCountDisplayProblem] = useState(15);
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false)

    React.useEffect(() => {
        dispatch(getProblemData()).then(response => {
            const { data } = response.payload;
            setProblems(data)
            const sliceProblems = data.slice(0, Number(countDisplayProblem))
            setResultProblem(sliceProblems)
        })
    }, [])

    const handleChange = (e) => {
        setLoading(true)
        let searchValue = e.target.value;
        const filterProblems = problems.filter(element => element.id === Number(searchValue) || element.name.match(new RegExp(searchValue, "i")))
        console.log(filterProblems)
        setKeyword(searchValue);    
        setResultProblem(filterProblems)

        setInterval(function(){ 
            setLoading(false)
        }, 500);
        
    }

    const handleChangeDisplayPro = (e) => {
        setLoading(true)
        const countValue = e.target.value;
        setCountDisplayProblem(countValue);

        const sliceProblems = problems.slice(0, Number(countValue))
        setResultProblem(sliceProblems);

        setInterval(function(){ 
            setLoading(false)
        }, 500);
    }
    const setDisplayListProblem = (e) =>{
        const temproblems = [...problems];
        if(e === "모두"){
            setResultProblem(temproblems)
            return;
        }
        const filterProblems = temproblems.filter(element => element.level === e);
        setResultProblem(filterProblems)
    }

    const blockSearch = keyword ? {display: "block"} : {display: "none"};
    const blockFotter = keyword && resultProblem.length === 0 ? {display: "none"} : {display: "block"};

    const [diffculty, setDiffculty ] = useState(false);

    return (
        <TotalProblemsLayout>
            <div className="totalproblems__page">
                <div className="container">
                    <div className="wrapper__search">
                        <div className="wrapper__search-key">
                            <input type="text" value={keyword} className="wrapper__search--text" onChange={handleChange} placeholder="이름, 번호를 입력하여 검색하세요."/>
                            <p style = {blockSearch}>{keyword}
                            &nbsp;<span style={{cursor: "pointer"}} onClick={() => setKeyword("")}>x</span>
                            </p>
                        </div>
                        <div className="wrapper__search--filter">
                            <div className="filter-title diffculty__container" onClick={() => setDiffculty(!diffculty)}>
                                난이도 
                                <i class="fa fa-caret-down"></i>
                                {
                                    diffculty ? 
                                        <div className="diffculty__container--select">
                                            <p onClick={() => setDisplayListProblem("하")}>하</p>
                                            <p onClick={() => setDisplayListProblem("중")}>중</p>
                                            <p onClick={() => setDisplayListProblem("상")}>상</p>
                                            <p onClick={() => setDisplayListProblem("모두")}>모두</p>
                                        </div> :
                                    ""
                                }
                            </div>
                            {/* <div className="filter-title" onClick={() => alert("현재 개발 중인 기능입니다.")}>
                                Status 
                                <i class="fa fa-caret-down"></i>
                            </div>
                            <div className="filter-title" onClick={() => alert("현재 개발 중인 기능입니다.")}>
                                List 
                                <i class="fa fa-caret-down"></i>
                            </div> */}
                            {/* <div className="filter-title" onClick={() => alert("현재 개발 중인 기능입니다.")}>
                                Tag 
                                <i class="fa fa-caret-down"></i>
                            </div> */}
                        </div>
                    </div>
                    <div className="wrapper__problems">
                        {
                            loading ? 
                            <WrapperLoading type={'bars'} color={'black'} />
                            :
                                keyword ? 
                                    resultProblem.length != 0 ?
                                        <ProblemDisplayTable problems = {resultProblem}/> 
                                    :
                                    <div style={{fontSize: '20px', textAlign: 'center', margin: '50px 0'}}>
                                        <p>검색 문제 업습니다</p>
                                    </div>
                                        
                                :
                                    resultProblem.length != 0 ?
                                        <ProblemDisplayTable problems = {resultProblem} /> 

                                    :
                                        problems.length != 0 ?
                                            <ProblemDisplayTable problems = {problems} />  :
                                        <WrapperLoading type={"bars"} color={"black"} />

                        }
                        <div className="row-selector" style={blockFotter}>
                            <select class="form-control" onChange={handleChangeDisplayPro} value={countDisplayProblem}>
                                <option value="15">15</option>
                                <option value="30" selected="">30</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="sort-caret">
                                문제수
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </TotalProblemsLayout>
    )
}

export default TotalProblemsPage

