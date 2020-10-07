import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Images from '../../constansts/Images'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header(props) {
    const user = useSelector(state => state.user);
    const currentPath = window.location.pathname;
    // const handleClickEditor = () => {
    //     const api_token = localStorage.getItem("redirect_token");
    //     window.open(`http://210.94.194.63:5110?id=${api_token}`, '_bank');
    // }
    const addStype = currentPath === '/' ? {
    } : {
        boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)'
    };
    return (
        <Wrapper>
            <div className="container" style={addStype} >
                <div className="header__logo">
                    <Link to="/"><img src={Images.logo} /></Link>
                </div>
                <nav>
                    <ul className="header__links">
                        <li>
                            <NavLink to="/" exact activeClassName='active_class'> 홈페이지</NavLink>
                        </li>
                        <li>
                            <NavLink to="/totalproblems" activeClassName='active_class'> 문제집</NavLink>
                        </li>
                        <li>
                            <NavLink to="/problemsbank" activeClassName='active_class'>카테고리별 문제</NavLink>
                        </li>
                        {/* <li>
                            <NavLink to="" onClick={() => handleClickEditor()} >에디터</NavLink>
                        </li> */}
                        {/* <li>
                            <NavLink to="/mylist" activeClassName='active_class' >내 문제</NavLink>
                        </li> */}
                        {/* <li><NavLink to="/board">게시판</NavLink></li> */}
                        {/* <li><NavLink to="/blog">블로그</NavLink></li> */}
                    </ul>
                </nav>
                {/* <div className="header__userInfo">
                    {
                        user.userData && user.userData.isAuth ?
                            <>
                                <h3>{user.userData.data.username}님</h3>
                            </> : "사용자 정보 출력 오류"
                    }
                </div> */}
            </div>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    min-height: 100px;
    max-height: 10vh;
    height: 10vh;
    position: relative;
    position: sticky;
    top: 0;
    width: 100vw;
    z-index: 10;
    background: white;
    .container{
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1920px;
        height: 100%;
        margin: auto;
        border-bottom: 1px solid #ddd;
        .header__logo{
            flex: 1;
            img{
                width: 95px;
                height: 100%; 
            }
        }
        nav{
            flex: 6;
            ul{
                display: flex;
                justify-content: flex-end;
                li{
                    margin-left: 5rem;
                    a{
                        color: rgba(0,0,0,0.5); 
                        &:hover{
                            color: black;
                        }
                    }
                }
            }
        }

        .header__userInfo{
            flex: 1;
            display: flex;
            justify-content: flex-end;
        }


        .active_class {
            color: black;
            padding-bottom:10px;
            border-bottom: 5px solid #ddd;
        }
    }
`

export default Header

