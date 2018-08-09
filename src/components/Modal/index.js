import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.sass'

import Button from '../Button'
import Rating from '../Rating'
import AVAILABLE_TYPES from '../../../AVAILABLE_TYPES.json'

function Modal(props){

	let header, body, footer

	switch (props.type) {
		case AVAILABLE_TYPES[0] :
			header = 'Item info'
			body   = Object.keys(props.item).map((key, idx) => {
				const id = Math.random().toString(16).slice(2, 8)
				if (key === 'id' || key === 'comment') return null
				return (
					<div key={idx} className="item">
						<label htmlFor={id}>{key[0].toUpperCase() + key.slice(1)}:</label>
						<div id={id} className="data">{key === 'rating' ? <Rating rating={props.item[key]}/> : props.item[key]}</div>
					</div>
				)
			})
			footer = <Button onClick={props.close}/>
			break
		case AVAILABLE_TYPES[1] :
			header = 'Edit item'
			body   = Object.keys(props.item).map((key, idx) => {
				const id = Math.random().toString(16).slice(2, 8)
				if (key === 'id') return null
				return (
					<div key={idx} className="item">
						<label htmlFor={id}>{key[0].toUpperCase() + key.slice(1)}:</label>
						{key === 'rating'
							? <Rating id={id} onlyRead={false} rating={props.item[key]}/>
							: key === 'comment'
								? <textarea className="data-textarea" type="text" id={id} defaultValue={props.item[key]}/>
								: <input className="data-input" type="text" defaultValue={props.item[key]}/>
						}
					</div>
				)
			})
			break
		case AVAILABLE_TYPES[2] :
			header = 'Confirm deletion'
			body   = <div className="item"><div className="data">Are you sure you want to delete "{props.item.name}"?</div></div>
			footer = [<Button key="0" onClick={props.close} isCancel/>, <Button key="1" onClick={() => {}}/>]
			break
	}

	header = <div className="header">{header}</div>
	body   = <div className="body">{body}</div>
	footer = <div className="footer">{footer}</div>

	return (
		<div className={classNames('Modal', props.className)} onClick={e => e.target.className === 'Modal' && props.close()}>
			<div className="Modal-window">
				{header}
				{body}
				{footer}
			</div>
		</div>
	)
}

Modal.propTypes = {
	type: PropTypes.oneOf(AVAILABLE_TYPES),
	close: PropTypes.func.isRequired
}

export default Modal