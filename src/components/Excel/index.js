import React, {PureComponent} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Rating from '../Rating'
import Actions from '../Actions'

class Excel extends PureComponent{

	constructor(props){
		super(props)
		this.state = {data: props.data, notSortedData: props.data, srcData: props.data, sortedColumn: -1, revers: false}
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

	render(){
		return (
			<table className={classNames('Excel', this.props.className)}>
				<thead>
					<tr>
						{this.props.headers.map((item, idx) => 
							<th key={item} onClick={this._sort}>
								{item}{this.state.sortedColumn === idx ? this.state.revers ? '-' : '+' : null}
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{this.state.data.map(el => 
						<tr key={el.id}>
							<td>{el.name}</td>
							<td>{el.year}</td>
							<td>{el.grape}</td>
							<td><Rating rating={el.rating} onlyRead={true}/></td>
							<td><Actions action={this.props.action.bind(null, el)}/></td>
						</tr>)
					}
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