import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style'

function Action(props){
	
	let innerHTML

	switch(props.type){
		case 'info': innerHTML = 'i'; break;
		case 'edit': innerHTML = '\u2710'; break;
		case 'delete' : innerHTML = 'x'; break;
	}

	return (
		<div
			onClick={props.action.bind(this, props.type)}
			className={classNames('Action', props.type)}>{innerHTML}
		</div>
	)
}

Action.propTypes = {
	type: PropTypes.oneOf(['info', 'edit', 'delete']).isRequired,
	action: PropTypes.func
}

Action.defaultProps = {
	action: () => {}
}

export default Action