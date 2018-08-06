import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Action from '../Action'

const AVAILABLE_TYPES = ['info' ,'edit', 'delete']

function Actions(props){
	const actions = props.types.map((type, idx) => <Action type={type} key={type} action={props.action}/>)
	return actions
}

Actions.propTypes = {
	types: ({types}, propName, componentName) => {
		if (Array.isArray(types) && types.every(el => AVAILABLE_TYPES.includes(el))) return
		if (typeof types === 'string' && AVAILABLE_TYPES.includes(types)) return
		return new Error(
			`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation faled`
		)
	},
	action: PropTypes.func
}

export default Actions