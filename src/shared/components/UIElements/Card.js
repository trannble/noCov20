import React from 'react';

import './Card.css';

function Card(props) {
	return (
		// accepts a prop (css class) & merges with its own css
		<div className={`card ${props.className}`} style={props.style}>
			{props.children}
		</div>
	);
}

export default Card;
