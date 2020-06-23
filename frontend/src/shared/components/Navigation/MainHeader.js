import React from 'react';

import './MainHeader.css';

function MainHeader(props) {
	// props.children is special React props -> will be filled from MainNavigation
	return <header className='main-header'>{props.children}</header>;
}

export default MainHeader;
