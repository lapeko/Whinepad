import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import './style.sass'
import data from '../../../serverData/data.json'
import headers from '../../../serverData/headExcel.json'
import Excel from '../Excel'

function Whinepad(props){		
	return (
		<div className={classNames('Whinepad', props.classNam)}>
			<div className="Whinepad__header">{/*<Logo/>*/}My whinepad !</div>
			<Excel data={data} headers={headers}/>
		</div>
	)
}

export default Whinepad