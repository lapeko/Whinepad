import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style'

class Rating extends Component{
	
	constructor(props){
		super(props)
		this.state = {
			rating:			this.props.rating > this.props.maxRating ? this.props.maxRating : this.props.rating,
			tmpRating:		this.props.rating > this.props.maxRating ? this.props.maxRating : this.props.rating,
			isYourRating:	this.props.isYourRating
		}
	}

	_mouseOver(num){
		this.setState({tmpRating: num + 1})
	}

	_leave(){
		this.setState({tmpRating: this.state.rating})
	}

	_click(num){
		this.setState({rating: num + 1, isYourRating: true})
	}

	render(){
		let stars = []
		for (let i = this.state.tmpRating; i--;)
			stars.push('\u2605')
		for (let i = this.state.tmpRating; i < this.props.maxRating; i++)
			stars.push('\u2606')

		let classes = classNames('Rating', this.props.className, {red: this.state.isYourRating}, {onlyRead: this.props.onlyRead})
		let spans = this.props.onlyRead
			? stars.map((e, idx) => <span className="star" key={idx}>{e}</span>)
			: stars.map((e, idx) =>
				<span
					className="star"
					key={idx}
					onMouseOver={this._mouseOver.bind(this, idx)}
					onClick={this._click.bind(this, idx)}
				>{e}</span>
			)
		
		return (
			<div className={classes} onMouseLeave={this._leave.bind(this)}>
				{spans}
			</div>
		)
	}
}

Rating.propTypes = {
	maxRating: PropTypes.number,
	rating: PropTypes.number,
	onlyRead: PropTypes.bool,
	isYourRating: PropTypes.bool
}

Rating.defaultProps = {
	maxRating: 5,
	rating: 1,
	onlyRead: true,
	isYourRating: false
}

export default Rating