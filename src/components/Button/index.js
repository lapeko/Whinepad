import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './style'

function Button(props){
	const innerText = props.value ? props.value : props.children ? props.children : 'Ok'
	let attributes = {className: classNames('Button', props.className), onClick: props.action}
	return props.href
		? <a {...attributes} href={props.href}>{innerText}</a>
		: <div {...attributes}>{innerText}</div>
}

Button.defaultProps = {
	action: () => {}
}

Button.propTypes = {
	action: PropTypes.func,
	href: PropTypes.string
}

export default Button