import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default class ListTag extends PureComponent {
    constructor(prop){
        super(prop);
    }
    static propTypes = {
        prop: PropTypes
    }
    render() {
        const { listtags, handleClickTag, tutorialId } = this.props; 
        return (
        <Wrapper>
            <ul>
                {
                    listtags.map((tag, idx) => {
                        return (
                            <li onClick={() => handleClickTag(tag.id)} >
                                <Link key={idx} to={`listproblems?id=${tutorialId}`}>{tag.name}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </Wrapper>
        )
    }
}
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
`
ListTag.propTypes = {
    listtags: PropTypes.array,
    handleClickTag: PropTypes.func
}