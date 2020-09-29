import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import TotalProblemsPage from './pages/TotalProblemsPage';

function TotalProblems(props) {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route exact path = {`${match.url}`} component = {TotalProblemsPage} />        
        </Switch>
    )
}

export default TotalProblems

