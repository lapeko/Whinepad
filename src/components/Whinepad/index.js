import React from 'react'
import classNames from 'classnames'
import './style.sass'

import Excel from '../Excel'

function Whinepad(props){		
	return (
		<div className={classNames('Whinepad', props.classNam)}>
			<div className="Whinepad__header">{/*<Logo/>*/}My whinepad !</div>
			<Excel data={props.data} headers={props.headers}/>
		</div>
	)
}

export default Whinepad