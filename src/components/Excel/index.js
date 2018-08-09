import React, {PureComponent} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './style.sass'

import Rating from '../Rating'
import Actions from '../Actions'

class Excel extends PureComponent{

	constructor(props){
		super(props)
		this.state = {
			data: props.data,
			notSortedData: props.data,
			srcData: props.data,
			sortedColumn: -1,
			revers: false,
			edit: false,
			rowEdit: -1,
			cellEdit: -1,
			widthCell: -1
		}
		this._sort = this._sort.bind(this)
	}

	_sort({target}){
		if (target.cellIndex > 3) return
		
		let sortFunc, newRevers = false
		
		if (this.state.sortedColumn === target.cellIndex)
			if (this.state.revers) this.setState({data: this.state.notSortedData, sortedColumn: -1, revers: false});
			else {
				sortFunc = (a, b) => a[target.firstChild.nodeValue.toLowerCase()] < b[target.firstChild.nodeValue.toLowerCase()]
				newRevers = true
			}
		else sortFunc = (a, b) => a[target.firstChild.nodeValue.toLowerCase()] > b[target.firstChild.nodeValue.toLowerCase()]
		
		sortFunc && this.setState({
			data: (this.state.data.slice().sort(sortFunc)),
			sortedColumn: target.cellIndex,
			revers: newRevers
		})
	}

	_db_click({target}){
		this.setState({
			edit: true,
			rowEdit: target.parentNode.rowIndex - 1,
			cellEdit: target.cellIndex,
			widthCell: target.offsetWidth
		})
	}

	_isEditItem(){
		let rowNum, cellNum
		if (arguments.length == 1){
			rowNum = arguments[0].parentNode.rowIndex - 1
			cellNum = arguments[0].cellIndex
		} else {
			rowNum = arguments[0]
			cellNum = arguments[1]
		}
		return !this.state.edit
			? false
			: this.state.rowEdit == rowNum && this.state.cellEdit == cellNum
				? true
				: false
	}

	_save(inputEvent){
		
		const td = inputEvent.target.parentNode
		const newValue = inputEvent.target.value
		const saveProperty = this.props.headers[td.cellIndex].toLowerCase()
		
		if (this._isEditItem(td)){
			
			let copyData = this.state.data.map(obj => Object.assign({}, obj))
			let copyNotSortedData = this.state.notSortedData.map(obj => Object.assign({}, obj))
			let copySrcData = this.state.srcData.map(obj => Object.assign({}, obj))
			let id = copyData[td.parentNode.rowIndex - 1].id
			
			copyData[td.parentNode.rowIndex - 1][saveProperty] = newValue
			changeById.bind(this)([copyNotSortedData, copySrcData], id)

			this.setState({data: copyData, edit: false, notSortedData : copyNotSortedData, srcData : copySrcData})

			function returnIndexById(arrObjects, idObject){
				for (let i = 0; i < arrObjects.length; i++)
					if (arrObjects[i].id == idObject) return i
				return -1
			}

			function changeById(arrays, id){
				arrays.forEach(arr => arr[returnIndexById(arr, id)][saveProperty] = newValue)
			}
		}
	}

	render(){
		return (
			<table className={classNames('Excel', this.props.className)}>
				<thead>
					<tr>
						{this.props.headers.map((item, idx) => 
							<th key={item} onClick={this._sort}>
								{item}<span className="orderChar">{this.state.sortedColumn === idx ? this.state.revers ? '▼' : '▲' : null}</span>
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{this.state.data.map((el, idx) => {
						return (
							<tr key={el.id} onBlur={this._save.bind(this)}>
								{this._isEditItem(idx, 0)
									?	<td style={{width: `${this.state.widthCell}px`}}>
											<input className="Excel__edit" type="text" defaultValue={el.name} autoFocus onSubmit={this._save.bind(this)}/>
										</td>
									: 	<td onDoubleClick={this._db_click.bind(this)}>{el.name}</td>
								}
								<td>{el.year}</td>
								<td>{el.grape}</td>
								<td><Rating rating={el.rating} onlyRead={true}/></td>
								<td><Actions action={this.props.action.bind(null, el)}/></td>
							</tr>
						)
					})}
				</tbody>
			</table>
		)
	}
}

Excel.propTypes = {
	action: PropTypes.func.isRequired,
	data: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		year: PropTypes.number,
		sort: PropTypes.string,
		rating: PropTypes.number,
		comment: PropTypes.string
	})).isRequired,
	headers: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Excel