import React from "react";

const PreviewBox = ({ item, deleteItem, id }) => (
    <div className="ga-preview-item">
        <div className="ga-preview-img"/>

        <div className="ga-preview-name">
            <span>{item.name}</span>
            {(!item.deleting)
                ? <i className="fa fa-times" aria-hidden="true" data-id={id} onClick={deleteItem}/>
                : <i className="fa fa-spinner ga-anim-loading" aria-hidden="true"/>
            }
        </div>
    </div>
);

export default PreviewBox;
