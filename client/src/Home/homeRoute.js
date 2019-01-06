import React from 'react';
import {Route} from 'react-router-dom';


export function HomeRoute(props) {
    let { onClick, component: Component, exact, path } = props; 
    const Exact = exact ? true : false; 

    return (
        <Route exact={Exact} path={path} render={(props) => (
            <Component onClick={onClick} />
        )} />
    );
}