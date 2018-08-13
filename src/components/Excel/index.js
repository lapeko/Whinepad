import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './style.sass'

import Rating from '../Rating'
import Actions from '../Actions'
import Modal from '../Modal'
import Button from '../Button'
import shemaData from '../../../serverData/shemaData.json'
import grapes from '../../../serverData/grapes.json'

class Excel extends Component{

	constructor(props){
		super(props)
		this.state = {
			data: props.data,
			filteredData: props.data,
			srcData: props.data,
			showModal: false,
			modalProps: null,
			sortedColumn: -1,
			revers: false,
			edit: false,
			rowEdit: -1,
			cellEdit: -1,
			widthCell: -1,
			findText: ''
		}
		this._sort = this._sort.bind(this)
	}

	_sort({target}){
		target = target.classList.contains('orderChar') ? target.parentNode : target
		const column = target.cellIndex

		if (target.cellIndex > 3) return
		
		let sortFunc, newRevers = false
		
		if (this.state.sortedColumn === target.cellIndex)
			if (this.state.revers) this.setState({data: this.state.filteredData, sortedColumn: -1, revers: newRevers});
			else {
				sortFunc = (a, b) => this.getValFromColmn(a, column) < this.getValFromColmn(b, column)
				newRevers = true
			}
		else sortFunc = (a, b) => this.getValFromColmn(a, column) > this.getValFromColmn(b, column)
		
		sortFunc && this.setState({
			data: (this.state.filteredData.slice().sort(sortFunc)),
			sortedColumn: target.cellIndex,
			revers: newRevers
		})
	}

	getValFromColmn(object, num){
		const value = object[this.props.headers[num].toLowerCase()]
		return typeof value == 'string' ? value.toLowerCase() : value
	}

	_db_click({target}){
		this.setState({
			edit: true,
			rowEdit: target.parentNode.rowIndex - 1,
			cellEdit: target.cellIndex,
			widthCell: target.offsetWidth
		})
	}

	isEditItem(){
		let rowNum, cellNum
		if (arguments.length == 1){
			rowNum = arguments[0].parentNode.rowIndex - 1;
			cellNum = arguments[0].cellIndex
		}
		else{
			rowNum = arguments[0]
			cellNum = arguments[1]
		}
		return !this.state.edit
			? false
			: this.state.rowEdit == rowNum && this.state.cellEdit == cellNum
				? true
				: false
	}

	_keyDownAction(e){
		e.keyCode == 13 && this.state.edit && this._saveFromTable(e)
		e.keyCode === 27 && (e.target.classList.contains('Excel__edit') ? this.setState({edit: false}) : this.setState({showModal: false}) )
	}

	_saveFromTable(inputEvent){
		const td = inputEvent.target.parentNode
		const newValue = inputEvent.target.value
		const saveProperty = this.props.headers[td.cellIndex].toLowerCase()
		
		if (this.isEditItem(td)){
			
			let [copyData, copyfilteredData, copySrcData] = this.getCopyDataArrays()
			let id = copyData[td.parentNode.rowIndex - 1].id
			
			copyData[td.parentNode.rowIndex - 1][saveProperty] = newValue
			changeById.bind(this)([copyfilteredData, copySrcData], id)

			this.setState({data: copyData, edit: false, filteredData : copyfilteredData, srcData : copySrcData})

			function changeById(arrays, id){
				arrays.forEach(arr => arr[this.returnIndexById(arr, id)][saveProperty] = newValue)
			}
		}
	}

	returnIndexById(arrObjects, idObject){
		for (let i = 0; i < arrObjects.length; i++)
			if (arrObjects[i].id == idObject) return i
		return -1
	}

	getCopyDataArrays(){
		const s = this.state
		return [s.data, s.filteredData, s.srcData].map(arr => this.getCopyDataArray(arr))
	}

	getCopyDataArray(arr){
		return arr.map(obj => Object.assign({}, obj))
	}

	_saveFromEdit(newItem){
		let arraysData = this.getCopyDataArrays()
		const indexes = arraysData.map(arr => this.returnIndexById(arr, newItem.id))
		arraysData.map((arr, idx) => arr[indexes[idx]] = newItem)
		this.setState({data: arraysData[0], filteredData: arraysData[1], srcData: arraysData[2], showModal: false})
	}

	_removeItem(item){
		const [a, b, c] = this.getCopyDataArrays().map(arr => { arr.splice(this.returnIndexById(arr, item.id), 1); return arr })
		localStorage.setItem('srcData', JSON.stringify(c))
		this.setState({data: a, filteredData: b, srcData: c, showModal: false})
	}

	_actionClick(item, type, event){
		this.setState({
			showModal: true,
			modalProps: {
				type: type,
				item: item,
				close: () => this.setState({showModal: false}),
				edit: newItem => this._saveFromEdit(newItem),
				remove: () => this._removeItem(item)
			}
		})
	}

	_find({target}){
		const filteredData = this.getFilteredData(target.value)
		const sortedAndFilteredData = this.getFilterANdSortedData(filteredData)
		this.setState({data: sortedAndFilteredData, filteredData, findText: target.value})
	}

	getFilteredData(findValue, srcData){
		srcData = srcData ? srcData : this.state.srcData
		return this.getCopyDataArray(srcData).filter(obj =>
			Object.keys(obj).some(key =>
				key === 'comment' ? false : obj[key].toString().toLowerCase().includes(findValue.toString().toLowerCase())
			)
		)
	}

	getFilterANdSortedData(filteredData){
		const column = this.state.sortedColumn
		if (column == -1)
			return this.getCopyDataArray(filteredData)
		else if(this.state.revers)
			return this.getCopyDataArray(filteredData).sort((a, b) => this.getValFromColmn(a, column) < this.getValFromColmn(b, column))
		return this.getCopyDataArray(filteredData).sort((a, b) => this.getValFromColmn(a, column) > this.getValFromColmn(b, column))
	}

	_add(){
		const self = this
		this.setState({showModal: true,
			modalProps: {
				close: () => this.setState({showModal: false}),
				create: (newItem) => create(newItem)
			}
		})
		function create(ni){
			ni.id = ++Excel.counterId
			let copyArr = self.getCopyDataArray(self.state.srcData)
			copyArr.push(ni)

			/*
			option 1
			*/
			// self.setState({
			// 	srcData: copyArr,
			// 	showModal: false,
			// 	sortedColumn: -1,
			// 	revers: false,
			// 	data: copyArr,
			// 	filteredData: copyArr,
			// 	findText: ''
			// })

			/*
			option 2
			*/
			const filteredData = self.getFilteredData(self.state.findText, copyArr)
			localStorage.setItem('srcData', JSON.stringify(copyArr))
			self.setState({
				srcData: copyArr,
				filteredData,
				data: self.getFilterANdSortedData(filteredData),
				showModal: false
			})
		}
	}

	render(){
		document.onkeydown = (e) => this._keyDownAction.bind(this)(e)
		return (
			<div className={classNames('Excel', this.props.className)}>
			{this.state.showModal && <Modal {...this.state.modalProps} />}
			<div className="Excel__service">
				<Button onClick={this._add.bind(this)} value="Add" />
				<input
					className="Excel__search"
					type="text"
					onChange={this._find.bind(this)}
					placeholder={`Search ${this.state.srcData.length} records...`}
					value={this.state.findText}
				/>
			</div>
			<table className="Excel__table">
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
						const attributsForInput = {
							className: "Excel__edit",
							autoFocus: true,
							onSubmit: this._saveFromTable.bind(this),
						}
						const id = Math.random().toString(10).slice(2, 8)
						return (
							<tr key={el.id} onBlur={this._saveFromTable.bind(this)}>
								{this.isEditItem(idx, 0)
									?	<td style={{width: `${this.state.widthCell}px`}}>
											<input {...attributsForInput} type="text" defaultValue={el.name}/>
										</td>
									: 	<td onDoubleClick={this._db_click.bind(this)}>{el.name}</td>
								}
								{this.isEditItem(idx, 1)
									?	<td style={{width: `${this.state.widthCell}px`}}>
											<input {...attributsForInput} type="number" defaultValue={el.year}/>
										</td>
									: <td onDoubleClick={this._db_click.bind(this)}>{el.year}</td>
								}
								{this.isEditItem(idx, 2)
									?	<td style={{width: `${this.state.widthCell}px`}}>
											<input list={id} {...attributsForInput} type="text" defaultValue={el.grape}/>
											<datalist id={id}>
												{grapes.map((grape, idx) => <option key={idx} value={grape}/>)}
											</datalist>
										</td>
									:	<td onDoubleClick={this._db_click.bind(this)}>{el.grape}</td>
								}
								<td><Rating rating={el.rating} onlyRead={true}/></td>
								<td><Actions action={this._actionClick.bind(this, el)}/></td>
							</tr>
						)
					})}
				</tbody>
			</table>
			</div>
		)
	}
}

Excel.counterId = 2;

Excel.propTypes = {
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