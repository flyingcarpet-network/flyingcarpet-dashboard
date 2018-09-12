import *  as React from 'react';

const SearchBox = ({styleName}) => {

    return (
        <div className={`search-bar right-side-icon bg-transparent ${styleName}`}>
            <div className="form-group">
                <input className="form-control border-0" type="search"/>
                <button className="search-icon"><i className="zmdi zmdi-search zmdi-hc-lg"/></button>
            </div>
        </div>
    )
};
export default SearchBox;
