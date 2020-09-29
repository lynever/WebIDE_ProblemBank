import React from 'react'
import Header from '../components/Header';
import FooterMainPage from '../pages/MainPage/components/FooterMainPage';

function ListProjectByCategoryLayout(props) {
    const { children } = props;
    return (
        <div className="row">
            <Header style={{}}/>
            <div className="body-container">
                { children }
            </div>
            <FooterMainPage />
        </div>
    )
}


export default ListProjectByCategoryLayout

