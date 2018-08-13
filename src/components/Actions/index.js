import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Action from '../Action'

import AVAILABLE_TYPES from '../../../serverData/AVAILABLE_TYPES.json'

function Actions(props){
	const actions = props.types.map((type, idx) => <Action type={type} key={type} action={props.action}/>)
	return actions
}

Actions.propTypes = {
	types: ({types}, propName, componentName) => {
		if (!types) return
		if (Array.isArray(types) && types.every(el => AVAILABLE_TYPES.includes(el))) return
		if (typeof types === 'string' && AVAILABLE_TYPES.includes(types)) return
		return new Error(
			`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation faled`
		)
	},
	action: PropTypes.func
}

Actions.defaultProps = {
	types: AVAILABLE_TYPES
}

export default Actions