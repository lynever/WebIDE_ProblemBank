import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import problemsBank from '../../../../apis/problemsBank'

function FavoritePanel() {
    const [listProblem, setListProblem] = useState([])

    useEffect(() => {
        try {
            const fetchData = async () => {
                const res = await problemsBank.getProblemFromMyList();
                const problems = res.data;
                setListProblem(problems);
            }
            fetchData();
        } catch (error) {
            console.log("서버 연결 실패합니다. 다시 시도해주세요.")
        }
    }, [])
    return (
        <Wrapper>
            <div className="favorite__pabel">
                <div className="favorite__header">
                    Default List
                </div>
                <div className="list__problem">
                    {
                        listProblem.length !== 0 && 
                            listProblem.map((item, idx) => 
                                <Link to={`problem/view?id=${item.id}`} key={idx}>
                                    {item.id}. {item.name}
                                </Link>
                        )
                            
                    }
                </div>
            </div>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    flex: 1;
    margin-left: 10px;
    .favorite__pabel{
        border: 1px solid #ddd;
        border-radius: 4px;
        .favorite__header{
            box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 1px;
            padding: 10px 20px;
            background: #F5F5F5;
        }
        .list__problem{
            padding: 5px 10px;
            display: flex;
            flex-direction: column;
            row-gap: 5px;
        }
    }
`
export default FavoritePanel
