import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Rating from '../Rating'
import shemaData from '../../../serverData/shemaData.json'
import AVAILABLE_TYPES from '../../../serverData/AVAILABLE_TYPES.json'
import grapes from '../../../serverData/grapes.json'

function InputModal(props){
	
	const id = Math.random().toString(16).slice(2, 8)
	
	let label, input
	props.mode == AVAILABLE_TYPES[2]
		? input = <div className="data">Are you sure you want to delete "{props.value}"?</div>
		: label = <label htmlFor={id} key="0">{props.type[0].toUpperCase() + props.type.slice(1)}:</label>

	const addGrapeScrollListener = (e) => {
		const input = e.target
		input.parentNode.parentNode.onscroll = (e) => {input.blur()}
	}

	const removeGrapeScrollListener = (e) => {
		const bodyModal = e.target.parentNode.parentNode
		if (bodyModal.onscroll) 
			document.getElementById('grapes').focus()
		bodyModal.onscroll = null
	}
	
	switch (props.type){
		//name
		case shemaData[1] :
			switch (props.mode){
				case AVAILABLE_TYPES[0]:
					input = <div id={id} className="data" key="1">{props.value}</div>
					break
				case AVAILABLE_TYPES[1]: 
					input = <input className="data-input" type="text" defaultValue={props.value}/>
					break
				case AVAILABLE_TYPES[2]:
					break
				default: 
					input = <input className="data-input" type="text"/>
					break
			}
			break
		//year
		case shemaData[2] :
			switch (props.mode){
				case AVAILABLE_TYPES[0]:
					input = <div id={id} className="data" key="1">{props.value}</div>
					break
				case AVAILABLE_TYPES[1]:
					input = <input className="data-input" type="number" defaultValue={props.value} max={new Date().getFullYear()}/>
					break
				case AVAILABLE_TYPES[2]:
					break
				default:
					input = <input className="data-input" type="number" defaultValue={new Date().getFullYear()} max={new Date().getFullYear()}/>
					break
			}
			break
		//grape
		case shemaData[3] :
			switch (props.mode){
				case AVAILABLE_TYPES[0]:
					input = <div id={id} className="data" key="1">{props.value}</div>
					break
				case AVAILABLE_TYPES[1]: 
					input = [
								<input
									onFocus={addGrapeScrollListener}
									onBlur={removeGrapeScrollListener}
									id="grapes"
									list={id}
									key="0"
									className="data-input"
									type="text"
									defaultValue={props.value}
								/>,
								<datalist id={id} key="1">
									{grapes.map((grape, idx) => <option key={idx} value={grape}/>)}
								</datalist>
							]
					break
				case AVAILABLE_TYPES[2]:
					break
				default: 
					input = [
								<input
									onFocus={addGrapeScrollListener}
									onBlur={removeGrapeScrollListener}
									id="grapes"
									list={id}
									key="0"
									className="data-input"
									type="text"
								/>,
								<datalist id={id} key="1">
									{grapes.map((grape, idx) => <option key={idx} value={grape}/>)}
								</datalist>
							]
					break
			}
			break
		//rating
		case shemaData[4] :
			switch (props.mode){
				case AVAILABLE_TYPES[0]:
					input =	<div id={id} className="data" key="1"><Rating rating={props.value}/></div>
					break
				case AVAILABLE_TYPES[1]: 
					input = <Rating
								change={props.changeRating}
								id={id}
								onlyRead={false}
								rating={props.value}
							/>
					break
				case AVAILABLE_TYPES[2]:
					break
				default:
					input = <Rating
								change={props.changeRating}
								id={id}
								onlyRead={false}
							/>
					break
			}
			break
		//comment
		case shemaData[5] :
			switch (props.mode){
				case AVAILABLE_TYPES[0]:
					input = <div id={id} className="data" key="1">{props.value}</div>
					break
				case AVAILABLE_TYPES[1]:
					input = <textarea rows={7} className="data-textarea" id={id} defaultValue={props.value}/>
					break
				case AVAILABLE_TYPES[2]:
					break
				default:
					input = <textarea rows={7} className="data-textarea" id={id} defaultValue={props.value}/>
					break
			}
			break
	}

	return (
		<div className="item" onChange={props.onChange}>
			{label}
			{input}
		</div>
	)
}

InputModal.propTypes = {
	type: PropTypes.oneOf(shemaData),
	mode: PropTypes.oneOf(AVAILABLE_TYPES),
	value: PropTypes.any,
	onChange: PropTypes.func
}

export default InputModal