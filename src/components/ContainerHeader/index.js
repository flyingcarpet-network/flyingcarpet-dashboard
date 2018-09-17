import * as React from 'react';

const getDisplayString = (sub) => {
    const arr = sub.split("-");
    if (arr.length > 1) {
        return arr[0].charAt(0).toUpperCase() + arr[0].slice(1) + " " + arr[1].charAt(0).toUpperCase() + arr[1].slice(1)
    } else {
        return sub.charAt(0).toUpperCase() + sub.slice(1)
    }

};

const ContainerHeader = ({title}) => {
    return (
        <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
            <h2 className="title mb-3 mb-sm-0">{title}</h2>
        </div>
    )
};

export default ContainerHeader;
