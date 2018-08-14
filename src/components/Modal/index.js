import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.sass'

import Button from '../Button'
import Rating from '../Rating'
import InputModal from '../InputModal'
import AVAILABLE_TYPES from '../../../serverData/AVAILABLE_TYPES.json'
import shemaData from '../../../serverData/shemaData.json'

class Modal extends PureComponent{

	constructor(props){
		super(props)
		this.state = {newItem: Object.assign({}, this.props.item)}
	}

	_change(key, eventOrValue){ this.setState({
		newItem: Object.assign({}, this.state.newItem, {[key]: eventOrValue.target ? eventOrValue.target.value : eventOrValue})
	})}

	componentWillMount(){
		if (!this.props.item){
			let copy = shemaData.slice(), newItem = {}
			copy.forEach(key => newItem[key] = '')
			newItem.year = new Date().getFullYear()
			newItem.rating = 1
			this.setState({newItem})
		}
	}

	componentDidMount(){
		document.body.onkeydown = (e) => {
			if (e.keyCode !== 27 && e.keyCode !== 13) return
			switch(this.props.type){
				case AVAILABLE_TYPES[0]:
					this.props.close()
					break
				case AVAILABLE_TYPES[1]:
					e.keyCode === 13 ? this.props.edit(this.state.newItem) : this.props.close()
					break
				case AVAILABLE_TYPES[2]:
					e.keyCode === 13 ? this.props.remove() : this.props.close()
					break
				default:
					e.keyCode === 13 ? this.props.create(this.state.newItem) : this.props.close()
					break
			}
		}
	}

	render(){
		let header, body, footer
		switch (this.props.type) {
			case AVAILABLE_TYPES[0] :
				header = 'Item info'
				body   = Object.keys(this.props.item).map((type, idx) => {
					const id = Math.random().toString(16).slice(2, 8)
					if (type == 'id' || !this.props.item[type]) return null
					return(
						<InputModal
							key={idx}
							type={type}
							value={this.props.item[type]}
							mode={this.props.type}
						/>
					)
				})
				footer = <Button onClick={this.props.close} right/>
				break
			case AVAILABLE_TYPES[1] :
				header = 'Edit item'
				body   = Object.keys(this.props.item).map((type, idx) => {
					const id = Math.random().toString(16).slice(2, 8)
					if (type === 'id') return null
					return (
						<InputModal
							key={idx}
							type={type}
							value={this.props.item[type]}
							mode={this.props.type}
							onChange={((type, event) => this._change(type, event)).bind(this, type)}
							changeRating={this._change.bind(this, type)}
						/>
					)
				})
				footer = [
					<Button key="0" onClick={this.props.close} isCancel/>,
					<Button key="1" onClick={this.props.edit.bind(null, this.state.newItem)} value="Save" right/>
				]
				break
			case AVAILABLE_TYPES[2] :
				header = 'Confirm deletion'
				body   = <InputModal mode={this.props.type} value={this.props.item.name}/>
				footer = [
					<Button key="0" onClick={this.props.close} isCancel/>,
					<Button key="1" onClick={this.props.remove}  right/>
				]
				break
			default :
				header = 'Add new item'
				body   = shemaData.map((type, idx) => {
					const id = Math.random().toString(16).slice(2, 8)
					if (type === 'id') return null
					return (
						<InputModal
							key={idx}
							type={type}
							mode={this.props.type}
							onChange={((type, event) => this._change(type, event)).bind(this, type)}
							changeRating={this._change.bind(this, type)}
						/>
					)
				})
				footer = [
					<Button key="0" onClick={this.props.close} isCancel/>,
					<Button key="1" onClick={this.props.create.bind(null, this.state.newItem)} value="Add" right/>
				]
		}

		header = <div className="header">{header}</div>
		body   = <div className="body">{body}</div>
		footer = <div className="footer">{footer}</div>

		return (
			<div
				className={classNames('Modal', this.props.className)}
				onClick={e => e.target.className === 'Modal' && this.props.close()}
			>
				<div className="Modal-window">
					{header}
					{body}
					{footer}
				</div>
			</div>
		)
	}
}

Modal.propTypes = {
	type: PropTypes.oneOf(AVAILABLE_TYPES.concat('create')),
	close: PropTypes.func.isRequired,
	edit: PropTypes.func,
	remove: PropTypes.func,
	create: PropTypes.func
}

export default Modal