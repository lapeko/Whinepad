import React from 'react'
import classNames from 'classnames'
import './style.sass'

import Excel from '../Excel'
import headExcel from '../../../serverData/headExcel.json'
import data from '../../../serverData/data.json'

function Whinepad(props){

	if (!JSON.parse(localStorage.getItem('initialized'))){
		localStorage.setItem('initialized', JSON.stringify(true))
		localStorage.setItem('srcData', JSON.stringify(data))
	}
	
	return (
		<div className={classNames('Whinepad', props.className)}>
			<div className="Whinepad__header">{/*<Logo/>*/}My whinepad !</div>
			<Excel data={JSON.parse(localStorage.getItem('srcData'))} headers={headExcel}/>
		</div>
	)
}

export default Whinepad