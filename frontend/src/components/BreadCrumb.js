import React from 'react'

export const BreadCrumb = (props) => {
    return (
    <>
    <div className="row">
        <div className="col">
            <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
            <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">{props.title}</li>
            </ol>
            </nav>
        </div>
    </div>
    </>
    )
}