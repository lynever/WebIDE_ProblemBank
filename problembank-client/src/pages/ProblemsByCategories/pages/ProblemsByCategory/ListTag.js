import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

ListTag.propTypes = {
    listtags: PropTypes.array,
    handleClickTag: PropTypes.func
}

function ListTag(props) {
    const { listtags, handleClickTag, tutorialId } = props; 
    const [ activeId, setActiveId ] = useState(0)

    return (
        <Wrapper>
            <ul>
                {
                    listtags.map((tag, idx) => {
                        console.log(activeId, idx)
                        return (
                            <li onClick={() => {
                                setActiveId(idx)
                                handleClickTag(tag.id)
                            }} className={Number(activeId) === Number(idx) ? "activeClass" : "list-tag"} >
                                <Link key={idx} to={`listproblems?id=${tutorialId}`}>{tag.name}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </Wrapper>
    )
}


export default ListTag

const Wrapper = styled.div`
    ul li{
        border-bottom: 1px solid #ccc;
        cursor: pointer;

        :hover{
            background: #282828;
            a {
                color: #fff;
            }
        }

        a{
            display: block;
            width: 100%;
            height: 100%;
            padding: 10px 0;
            text-align: center;
        }
    }
    ul li:first-child{
        margin-top: 0px;
    }

    .activeClass{
        background: #282828;
        a {
            color: #fff;
        }
    }
`
