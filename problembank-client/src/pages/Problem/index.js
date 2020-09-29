import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import DetailProblem from './pages/DetailProblem';

function Problem(props) {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route exact path = {`${match.url}/view`} component = {DetailProblem} />        
        </Switch>
    )
}

export default Problem

