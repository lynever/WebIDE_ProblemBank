import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import './style.scss'
var moment = require('moment');

function ProblemDisplayTable(props) {
    const { problems } = props;
    return (
        <table className="table table-contribution">
            <thead>
                <tr>
                    <th width = "5%">번호</th>
                    <th width = "55%">제목</th>
                    <th width = "10%">난이도</th>
                    <th width = "10%">작성일</th>
                    <th width = "20%">카테고리</th>
                </tr>
            </thead>
            <tbody>
                {
                    problems.map((item,index) => {
                        return (
                            <tr key = {index} onClick={() => props.history.push('/problem/view?id=1')}>
                                <th>{item.id}</th>
                                <td>{item.name}</td>
                                <th>{item.level}</th>
                                <th>{moment(item.created).format("YYYY-MM-DD")}</th>
                                <td>{item.category}</td>
                            </tr>
                        )
                    })
                }
            </tbody>     
        </table>
    )
}
export default withRouter(ProblemDisplayTable)


