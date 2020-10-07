import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import qs from 'query-string'
import ListProblem from '../ListProblem'
import ListTag from './ListTag'
import Loading from 'react-loading'
import problemsBank from '../../../../apis/problemsBank'
import ListProjectByCategoryLayout from '../../../../layouts/ListProjectByCategoryLayout'
import WrapperLoading from '../../../../components/WrapperLoading';

export default class ProblemsByCategory extends Component {
    constructor(props){
        super(props);
        this.state ={
            detailstutorial: [],
            problems: [],
            loading: true,
        }
    }

    async componentDidMount(){
        try {
            const { id } = qs.parse(this.props.location.search);
            
            const params = {
                id: id
            }   
            const response  = await problemsBank.getProblemsBankByCategoryID(params)
            
            const { data } = response;
            const childCategories = data.map(element => element)
            const firstProblems = childCategories[0].problems

            this.setState(() => {
                return {
                    detailstutorial: childCategories,
                    loading: false,
                    problems: firstProblems,
                }
            })
        } catch (error) {
            console.log(error)
        }       
    }
    getProblemsByTagId = (childTagId) => {
        let { detailstutorial } = this.state;
        for(let i = 0; i < detailstutorial.length; i++)
        {
            const { id } = detailstutorial[i];
            if(id === childTagId)
            {
                const { problems } = detailstutorial[i];
                return problems;
            }
		}
    }
    handleClickTag = (id) => {
        const problems = this.getProblemsByTagId(id);
        this.setState({
            problems : problems
        })
    }

    render() {
        const { detailstutorial, problems, loading} = this.state;
        if(loading)
        {
            return <WrapperLoading /> 
        }else{
            const { id } = qs.parse(this.props.location.search);
            return (
                <ListProjectByCategoryLayout>
                    <div className="problems__by--category">
                        <div className="list__child--category">
                            <ListTag listtags = {detailstutorial} tutorialId = {id} handleClickTag = {this.handleClickTag} />
                        </div>
                        <div className="list__problems">
                            <ListProblem {...this.props} problems = {problems} handleClickTag = {this.handleClickTag}/>
                        </div>
                    </div>
                </ListProjectByCategoryLayout>
            )
        }
    }
}
