import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.sass'

import Button from '../Button'
import Rating from '../Rating'
import AVAILABLE_TYPES from '../../../serverData/AVAILABLE_TYPES.json'
import shemaData from '../../../serverData/shemaData.json'
import grapes from '../../../serverData/grapes.json'

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

	render(){
		let header, body, footer
		switch (this.props.type) {
			case AVAILABLE_TYPES[0] :
				header = 'Item info'
				body   = Object.keys(this.props.item).map((key, idx) => {
					const id = Math.random().toString(16).slice(2, 8)
					if (key === 'id' || !this.props.item[key]) return null
					return (
						<div key={idx} className="item">
							<label htmlFor={id}>{key[0].toUpperCase() + key.slice(1)}:</label>
							<div id={id} className="data">{key === 'rating' ? <Rating rating={this.props.item[key]}/> : this.props.item[key]}</div>
						</div>
					)
				})
				footer = <Button onClick={this.props.close} right/>
				break
			case AVAILABLE_TYPES[1] :
				header = 'Edit item'
				body   = Object.keys(this.props.item).map((key, idx) => {
					const id = Math.random().toString(16).slice(2, 8)
					if (key === 'id') return null
					return (
						<div key={idx} className="item" onChange={((key, event) => this._change(key, event)).bind(this, key)}>
							<label htmlFor={id}>{key[0].toUpperCase() + key.slice(1)}:</label>
							{key === 'year'	
								? <input className="data-input" type="number" defaultValue={this.props.item[key]}/>
								: key === 'rating'
									? <Rating
										change={ this._change.bind(this, key) }
										id={id}
										onlyRead={false}
										rating={this.props.item[key]}
									/>
									: key === 'comment'
										? <textarea rows={7} className="data-textarea" type="text" id={id} defaultValue={this.props.item[key]}/>
										: key == 'grape'
											? [
												<input id={id} list={id + 1} key="0" className="data-input" type="text" defaultValue={this.props.item[key]}/>,
												<datalist id={id + 1} key="1">
													{grapes.map((grape, idx) => <option key={idx} value={grape}/>)}
												</datalist>
											]
											: <input className="data-input" type="text" defaultValue={this.props.item[key]}/>
							}
						</div>
					)
				})
				footer = [
					<Button key="0" onClick={this.props.close} isCancel/>,
					<Button key="1" onClick={this.props.edit.bind(null, this.state.newItem)} value="Save" right/>
				]
				break
			case AVAILABLE_TYPES[2] :
				header = 'Confirm deletion'
				body   = <div className="item"><div className="data">Are you sure you want to delete "{this.props.item.name}"?</div></div>
				footer = [
					<Button key="0" onClick={this.props.close} isCancel/>,
					<Button key="1" onClick={this.props.remove}  right/>
				]
				break
			default :
				header = 'Add new item'
				body   = shemaData.map((key, idx) => {
					const id = Math.random().toString(16).slice(2, 8)
					if (key === 'id') return null
					return (
						<div key={idx} className="item" onChange={((key, event) => this._change(key, event)).bind(this, key)}>
							<label htmlFor={id}>{key[0].toUpperCase() + key.slice(1)}:</label>
							{key === 'year'	
								? <input id={id} className="data-input" type="number" defaultValue={this.state.newItem.year}/>
								: key === 'rating'
									? <Rating
										change={ this._change.bind(this, key) }
										id={id}
										onlyRead={false}
									/>
									: key === 'comment'
										? <textarea rows={7} className="data-textarea" type="text" id={id}/>
										: key == 'grape'
											? [
												<input id={id} list={id + 1} key="0" className="data-input" type="text"/>,
												<datalist id={id + 1} key="1">
													{grapes.map((grape, idx) => <option key={idx} value={grape}/>)}
												</datalist>
											]
											: <input id={id} className="data-input" type="text"/>
							}
						</div>
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
			<div className={classNames('Modal', this.props.className)} onClick={e => e.target.className === 'Modal' && this.props.close()}>
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