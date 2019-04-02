import React, {Component} from 'react';
import _ from 'lodash';


const ContentLists = (props) => {

    const contentListChangeHandler = (e, index) => {
        const name = e.target.name;
        const value = parseInt(e.target.value);
        let newRuleLists = [...props.ruleLists];

        newRuleLists[index][name] = value;

        props.save(newRuleLists);
    }

    const createPositionOptions = list => {
        if (!Number.isInteger(list.id)) return null;

        let listObj = allContentLists.find(al => al.id === list.id);
        let count = listObj.contentListItemsCount;
        let options = [];

        for (let i = 0; i < count; i++) {
            options.push(<option key={'optionelement' + list.id + '' + i} value={i}>{i+1}</option>)
        }

        if (!count) {
            options.push(<option key={'optionelement' + list.id + '0'} value={0}>{1}</option>)
        }

        return options
    };

    let ruleLists = [...props.ruleLists];
    let allContentLists = [...props.contentLists]
    let remainingLists = [...props.contentLists];

    ruleLists.forEach(list => {
        let index = remainingLists.findIndex(rlist => list.id === rlist.id);
        if (index => 0 ) {
            remainingLists.splice(index,1);
        }
    });

    let addButton = null;

    if (remainingLists.length) {
        addButton = (
            <div className="form__row">
                <button className="btn btn--hollow btn--expanded btn--primary" onClick={props.addList}>Add to content list</button>
            </div>
        );
    }



    return (
        <div style={{margin: '1em 0'}}>
            <label className="form-label">Content lists</label>
            {ruleLists.map( (list, index) => (
                <div className="sd-list-item sd-list-item--no-hover sd-margin-b--1"  key={'list_el' + index}>
                    <div className="sd-list-item__column sd-list-item__column--grow">
                        <div className="sd-list-item__row sd-list-item__row--only-child">
                            <span className="sd-margin-r--1">Choose list</span>
                            <div className="sd-line-input sd-line-input--is-select sd-list-item--element-grow sd-line-input--no-margin">
                                <select className="sd-line-input__select" value={list.id} name="id" onChange={(e) => contentListChangeHandler(e, index)}>
                                    <option value=""></option>
                                    {allContentLists.map(rl => <option value={rl.id} key={'select' + list.id + '-' + rl.id}>{rl.name}</option>)}
                                </select>
                            </div>
                            <a className="icn-btn disabled" sd-tooltip="Remove list" flow="left" onClick={() => props.removeList(index)}><i className="icon-trash"></i></a>
                        </div>
                        <div className="sd-list-item__row sd-margin-b--1">
                            <span className="sd-margin-r--1">Set order</span>
                            <div className="sd-line-input sd-line-input--is-select sd-list-item--element-grow sd-line-input--no-margin sd-line-input--no-label sd-margin-r--2">
                                <select className="sd-line-input__select" value={list.position} name="position" onChange={(e) => contentListChangeHandler(e, index)}>
                                  {createPositionOptions(list)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {addButton}
        </div>
    );
}

export default ContentLists;
