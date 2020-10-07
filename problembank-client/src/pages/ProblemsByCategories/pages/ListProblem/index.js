import React, { Component, useState } from 'react'
import {FaEdit } from 'react-icons/fa';
import './style.scss'
import qs from 'query-string'
import Loading from 'react-loading';
import Editor from "@monaco-editor/react";
import SampleCode from '../../../../constansts/SampleCode'

import IO from 'socket.io-client';
import Alert from '../../../../components/Alert/Alert';


import projectsAPI from '../../../../apis/projects';
import ProblemDisplayTable from '../../components/ProblemDisplayTable';
var moment = require('moment');
export default class ListProblem extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			problems: [],
			loading: true,
			singleProblem: {},
			displayProblem: !this.props.displayList,
			countDisplayProblem: 15
		}
	}
	getProblemsByTagId = async (childTagId) => {
		let { listTutorials } = this.props;
        let child  ='';
        for(let i = 0; i < listTutorials.length; i++)
        {
			const { childTag } = listTutorials[i];
			child = childTag.filter(element => element.id === parseInt(childTagId))
			if(child.length !== 0){
				const problems = child[0].problems;
				this.setState(() => {
					return { problems, loading: false}
				})
			}
		}
    }
	componentDidMount(){
		let { problems, handleClickTag } = this.props;
		const { tagid } = qs.parse(this.props.location.search);
		if(tagid){
			handleClickTag(tagid);
		}
		this.setState(() => {
			return {
				problems,
				loading : false
			}
		})

	}
	handleFiltersChange = (newFilters) => {
		const { option, text } = newFilters;
		if(!text)
		{
			window.location.reload();
		}
		switch (option) {
			case "제목":
				var filteredText = this.props.listProblem.filter((element) => element.name.includes(text))
				this.setState({
					listProblem : filteredText,
					loading: false
				})
				break;
			case "난이도":
				var filteredLevel = this.props.listProblem.filter((element) => element.name.includes(text))
				this.setState({
					listProblem : filteredLevel,
					loading: false
				})
				break;
			default: //default 난이도
				window.location.reload();
				break;
		}
	}
	static getDerivedStateFromProps(nextProps, currentState) {
		if (nextProps.problems !== currentState.problems) {
			return {
				problems: nextProps.problems,
				displayProblem: false
			};
		}
		return null;
	}
	handleDetailsProblem = (id) => {
		const { problems } = this.state;
		const problem = problems.filter(element => element.id === id)[0];
		this.setState(() => {
			return{
				singleProblem : problem,
				displayProblem: true,
			}
		})
	}
	handlePrevProblems = (id) => {
		const { problems } = this.state;
		let problem = problems.filter(element => element.id === id);
		let index = problems.findIndex(item => item.id === problem[0].id);
		if((index-1) === -1)
			return;
		let prevProblem = problems[index-1];
		this.setState({
			singleProblem : prevProblem
		})
	}
	handleNextProblems = (id) => {
		const { problems } = this.state;
		let problem = problems.filter(element => element.id === id);
		let index = problems.findIndex(item => item.id === problem[0].id);
		if((index+1) === problems.length)
			return;
		let nextProblem = problems[index+1];
		this.setState({
			singleProblem : nextProblem
		})
	}
	handleChangeDisplayPro = (e) => {
		this.setState({
			countDisplayProblem: e.target.value
		})
	}



	
	render() {
		let {loading, displayProblem, singleProblem, countDisplayProblem } = this.state;
		let { problems } = this.props;
		if(loading)
		{
			return (
				<Loading/>
			)
		}
		if(displayProblem){
			return (
				<DetailProblem problem = {singleProblem} 
				problems = {problems}
				handlePrevProblems = {this.handlePrevProblems}
				handleNextProblems = {this.handleNextProblems}
				/>
			)
		}
        return (
            <div className = "list__problems--wrappers">
				
						{/* <Link to = "list" style={{
							padding: '5px',
							border: "1px solid black",
							fontSize: "2rem",
							background: "#695b50",
							color: "white"
						}}>이전 화면</Link> */}
					{/* <Search
						onSubmit = {this.handleFiltersChange}
						method = "search-problems"
						option = {
							[ '제목', '난이도']
						}
					/> */}
					{
						problems.length !== 0 ?
						<div className = "list__problems--content">
						<h3>
							<i class="fa fa-th-large" aria-hidden="true"></i> 모든 문제
						</h3>
							<ProblemDisplayTable problems = {problems} />
							<div className="row-selector">
								<select class="form-control" onChange={this.handleChangeDisplayPro} value={countDisplayProblem}>
									<option value="20">15</option>
									<option value="30" selected="">30</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
								<span className="sort-caret">
									문제수
								</span>
							</div>
							{/* <table className="table table-contribution">
								<thead>
									<tr>
										<th width = "10%">문제 번호</th>
										<th width = "35%">제목</th>
										<th width = "10%">난이도</th>
										<th width = "10%">작성일</th>
										<th width = "5%">수정</th>
									</tr>
								</thead>
								<tbody>
									{
										problems.map((item,index) => {
											return (
												<tr key = {index}>
													<td>{item.id}</td>
													<td style = {{cursor : "pointer"}} onClick = {(event) => {event.preventDefault(); this.handleDetailsProblem(item.id, "details")}}>{item.name}</td>
													<td>{item.level}</td>
													<td>{moment(item.created).format("YYYY-MM-DD")}</td>
													<td style = {{cursor : "pointer"}} onClick = {(event) => {event.preventDefault(); this.handleDetailsProblem(item.id, "modify")}}><FaEdit/></td>
												</tr>
											)
										})
									}
								</tbody>     
							</table> */}
						</div>
						: <div style ={{
							textAlign:"center",
							marginTop:"10rem",
							fontSize:"2rem"
						}}>문제가 추가 될 예정입니다</div>
						}
            </div>
        )
    }
}
function DetailProblem({problems, problem, handlePrevProblems, handleNextProblems}){

	let category = "";
	switch (problem.category) {
		case "C/C++":
			category = "c";
			break;
		case "JAVA":
			category = "java";
		case "Python":
			category = "Python";
		default:
			category = "cpp";
			break;
	}
	const options = {
		selectOnLineNumbers: true
	};
	const [editorContent, setEditorContent] = useState(SampleCode['c'])
	const [submit, setSubmit] = useState(false);
	const [language, setLanguage] = useState("c");

	function getSimpleCode (language)
	{
		let simpleCode = SampleCode[language];
		return simpleCode;
	}

	function handleChangeContent(content){
		setEditorContent(content)
        var editor = localStorage.getItem("editor");
        editor = editor ? JSON.parse(editor) : {};
        editor['editorContent'] = content;
        localStorage.setItem("editor", JSON.stringify(editor));
    }

	function handleLanguage(event){
        let language = event.target.value
		let simpleCode = getSimpleCode(language);
		
		setLanguage(language);
		setEditorContent(simpleCode);

        var valueEditor = {
            language : language,
            editorContent : simpleCode
		}
		//풀고 있는 코드를 localStore 저장함
        localStorage.setItem("editor", JSON.stringify(valueEditor))
	}
	
	//!Socket exchange
	async function handleAnswerSubmit(){
		setSubmit(true);
					
		const problemId = qs.parse(window.location.search).id;
		const IO_URL = process.env.REACT_APP_SERVER_API + "/projects";

		const params = {
			sourceCode: editorContent,
			language,
			problemId: Number(problemId)
		}

		const response = await projectsAPI.compile(params);
		const { data } = response;
		alert(`체점 결과 ${data.correctCount} / ${data.count}`);
		// 	setSubmit(false);
		// const socket = IO(IO_URL);
		// socket.emit("projects", {
		// 	sourceCode: editorContent, language, problemId: Number(problemId)
		// });

		// socket.on("result", (data) => {
		// 	alert(`체점 결과 ${data.correctCount} / ${data.count}`);
		// 	setSubmit(false);
		// });

		var timeOutSubmit = function(){
			setSubmit(false);
			alert("서버오류입니다. 잠시 후 다시 시도해주세요.");
		};
		setTimeout(timeOutSubmit, 3000);
        // Alert({ 
        //     title : "제출하시겠습니까?",
        //     btns : [
        //         {
        //             text: "예", onClick: () => {
        //                 try {
		// 					setSubmit(true);


        //                     // const problemId = qs.parse(window.location.search).id;
        //                     // const IO_URL = process.env.REACT_APP_API_IDE_URL + "/problems";
        //                     // const socket = IO(IO_URL);
                    
        //                     // socket.emit("problems", {
        //                     //     sourceCode: editorContent, language, problemId: Number(problemId)
        //                     // });
                    
        //                     // socket.on("result", (data) => {
        //                     //     alert(`체점 결과 ${data.correctCount} / ${data.count}`);
		// 					// 	setSubmit(false);
		// 					// });

		// 					var timeOutSubmit = function(){
		// 						setSubmit(false);
		// 						alert("서버오류입니다. 잠시 후 다시 시도해주세요.");
		// 					};
		// 					setTimeout(timeOutSubmit, 3000);
							
        //                 } catch (error) {
		// 					alert("서버오류입니다. 잠시 후 다시 시도해주세요.");
        //                     console.log(error);
        //                 }

        //             }
        //         },{
        //             text: "아니오", onClick: () => {}
        //         }
        //     ]
        // })
	}

	return (
	<div  className = "problem__detail">
			<div className="nextTop">
				<button onClick= {() => handlePrevProblems(problem.id)} disabled={problem.id === problems[0].id}>앞 문제</button>
				<button onClick= {() => handleNextProblems(problem.id)} disabled={problem.id === problems[problems.length-1].id}>뒤 문제</button>
			</div>
			<div className = "problem__detail--name">
				<span>{problem.id}.{problem.name}</span>
				{/* <button to = "#"  className = "btn btn_primary" onClick = {() => this.handleDisplayEditor()}>프로젝트 생성</button> */}
			</div>
			<div className = "problem__detail--content">
				<div className = "define border-btm">
					<h3>문제</h3>
					<p>
					{problem.content}
					</p>   
				</div>    
				<div className = "problem_input border-btm">
					<h3>입력</h3>
					<p>
					{problem.input}
					</p>
				</div>    
				<div className = "problem_output border-btm">
					<h3>출력</h3>
					<p>
					{problem.output}
					</p>
				</div>                                           
				<div className = "problem-example">                   
					<div className = "example_input">
						<h3 >입력 예제 1</h3><br/>
						<textarea className="form-control" cols="55"rows="12" disabled value = {problem.input_example}>
						</textarea>
					</div>
					<div className = "example_output">
						<h3 >출력 예제 1</h3><br/>
						<textarea className="form-control" cols="55" rows="12" disabled  value =  {problem.output_example}>
						</textarea>
					</div>
				</div>    
			</div>
			<div className="problem__detail--editor">
				<Editor
					width="100%"
					height="100%"
					theme="dark"
					language={category}
					value={SampleCode[category]}
					onChange={handleChangeContent}
					// editorDidMount={handleEditorDidMount}
					// loading={<Loading />}
				/> 
				<div className="option__submit">
					<button style={{background: 'blue', color: 'white'}} onClick={() => handleAnswerSubmit()}>채점</button>
					<button style={{background: 'yellow', color: 'black'}}>리셋</button>
				</div>
			</div>
		</div>
	)
}
