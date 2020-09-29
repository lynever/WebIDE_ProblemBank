import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './styles.scss'
import { ControlledEditor } from "@monaco-editor/react";
import SampleCode from '../../../../contans/SampleCode';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string'
import { getProblemData } from '../../../../_actions/problemAction';
import projectsAPI from '../../../../api/projects';
import WrapperLoading from '../../../../components/WrapperLoading';
var moment = require('moment');

function DetailProblem(props) {
    const [problems, setProblems] = useState([])
    const [problem, setProblem] = useState({})
    const { problemsAllData } = useSelector(state => state.problem);

    const [language, setLanguage] = useState("c")
    const [contentEditor, setContentEditor] = useState(SampleCode["c"])
    const [submit, setSubmit] = useState(false)
    const [theme, setTheme] = useState("white")
    
    const dispatch = useDispatch();
    
    
    const { id } = queryString.parse(props.location.search);

    useEffect(() => {
        if(problemsAllData){
            const { data }  = problemsAllData;
            const [ problem ] = data.filter(element =>Number(element.id) === Number(id))

            setProblems(data)
            setProblem(problem)
        }else{
            dispatch(getProblemData()).then(response => {
                const { data } = response.payload
                const [ problem ] = data.filter(element =>Number(element.id) === Number(id))

                setProblems(data)
                setProblem(problem)
            })
        }
    }, [id])

    const handleEditorChange = (env, value) => {
        setContentEditor(value)
    }
    
    //submit content editor & problem
    const onSubmit = async () => {
        try {
    
            setSubmit(true);
                        
            const problemId = queryString.parse(window.location.search).id;
    
            // const IO_URL = process.env.REACT_APP_SERVER_API + "/projects";
    
            const params = {
                sourceCode: contentEditor,
                language,
                problemId: Number(problemId)
            }
    
            const response = await projectsAPI.compile(params); 
            console.log(response)
            
            const { data } = response;
            
            var timeOutSubmit = function(){
                alert(`체점 결과 ${data.correctCount} / ${data.count}`);
                setSubmit(false);
            };
            setTimeout(timeOutSubmit, 1000);
            
        } catch (error) {
            alert("서버오류입니다. 잠시 후 다시 시도해주세요.");
            console.log(error)
        }

    }
    return (
        <div className="problem__detail">
            <div className="problem__detail--content">
                <div className="tab__header">
                    <ul className="tab__header--content">
                        <li style={{background: 'white'}} onClick={() => alert("현재 개발중인 기능 입니다...")}>설명</li>
                        <li onClick={() => alert("현재 개발중인 기능 입니다...")}>답안</li>
                        <span>|</span>
                        <li onClick={() => alert("현재 개발중인 기능 입니다...")}>토론</li>
                        <span>|</span>
                        <li onClick={() => alert("현재 개발중인 기능 입니다...")}>Submit</li>
                    </ul>
                </div>
                <div className="wrapper__content">
                    <h3>{problem.id}. {problem.name}</h3>
                    <ul className="tab__header--task">
                        <li style={{cursor: 'pointer'}} onClick={() => alert("현재 개발중인 기능 입니다...")}><i className="fa fa-list-alt"></i> Add to list</li>
                        <li style={{cursor: 'pointer'}} onClick={() => alert("현재 개발중인 기능 입니다...")}><i className="fa fa-share-square-o"></i> Share</li>
                        <li>Created: {moment(problem.created).format("YYYY-MM-DD")}</li>
                        <li>Language: {problem.category}</li>
                    </ul>
                    <div className="problem__infor">
                        <div className="problem__infor--desc">
                            <p>문재 정의</p>
                            <span>{problem.content}</span>
                        </div>
                        <div className="problem__infor--input">
                            <p>입력</p>
                            <span>{problem.input}</span>
                        </div>
                        <div className="problem__infor--output">
                            <p>츨력</p>
                            <span>{problem.output}</span>
                        </div>
                        <div className="problem__infor--inputexp">
                            <p>입력 예제</p>
                            <span>첫번째 선수 또는 두번째 선수 승리!!</span>
                        </div>
                        <div className="problem__infor--outputexp">
                            <p>출력 예제</p>
                            <span>첫번째 선수 또는 두번째 선수 승리!!</span>
                        </div>
                    </div>
                </div>
                <div className="tab__footer">
                    <div className="review__listproblem">
                        <span onClick={() => props.history.push('/totalproblems')}><i className="fa fa-list"></i>&nbsp;Problem</span>
                    </div>
                    <div className="pre-next-problem">
                        {
                            problems.length !== 0 ?
                                <>
                                <button onClick={() => props.history.push(`/problem/view?id=${problem.id - 1}`)} disabled={problem.id === problems[0].id} >Prev</button>&nbsp;
                                    <span>{problem.id}/{problems.length}</span>&nbsp;
                                <button onClick={() => props.history.push(`/problem/view?id=${problem.id + 1}`)} disabled={problem.id === problems[problems.length-1].id}>Next</button>
                                </>
                            : ""
                            
                        }
                    </div>
                </div>
            </div>
            <div className="problem__detail--vseditor">
                <div className="tab__header--editor">
                    <ul>
                        <li>
                            <span>언어 </span>
                            <select name="" id="" className="language" value = {language} onChange={e => { setLanguage(e.target.value); setContentEditor(SampleCode[e.target.value])}}>
                                <option value="c">C</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="python">Python</option>
                                <option value="r">R</option>
                            </select>
                        </li>
                        <li>
                            <span>Editor Theme </span>
                            <select name="" id="" className="language" value={theme} onChange={(e) => setTheme(e.target.value)}>
                                <option value="white">White</option>
                                <option value="dark">Dark</option>
                            </select>
                        </li>
                    </ul>
                </div>
                <div className="wrapper__editor">
                        {
                            submit ? 
                            <div className="wrapper__editor--submit">
                                <WrapperLoading />
                            </div> : ""
                        }
                        <ControlledEditor
                            width="100%"
                            height="100%"
                            theme={theme}
                            language={language}
                            value={contentEditor}
                            onChange={handleEditorChange}
                            loading={<WrapperLoading />}
                        /> 
                    <div className="tab__footer">
                        <button onClick={() => onSubmit()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default DetailProblem

