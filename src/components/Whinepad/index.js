import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.sass'

import Excel from '../Excel'
import Modal from '../Modal'

class Whinepad extends Component{
	
	constructor(props){
		super(props)
		this.state = {showModal: false, modalProps: null}
		this._action = this._action.bind(this)
	}

	_keyDown(event){
		event.keyCode == 27 && this.state.showModal && this._closeModal()
	}

	_closeModal(){
		this.setState({showModal: false, modalProps: {}})
	}

	_editItem(){

	}

	_action(item, type, event){
		this.setState({
			showModal: true,
			modalProps: {
				type: type,
				item: item,
				close: this._closeModal.bind(this),
				edit: this._editItem.bind(this),
				remove: () => {}
			}
		})
	}

	render(){
		document.addEventListener('keydown', this._keyDown.bind(this))
		return (
			<div className={classNames('Whinepad', this.props.classNam)}>
				<div className="Whinepad__header">{/*<Logo/>*/}My whinepad !</div>
				<Excel data={this.props.data} headers={this.props.headers} action={this._action}/>
				{this.state.showModal ? <Modal {...this.state.modalProps} /> : null}
			</div>
		)
	}
}

export default Whinepad