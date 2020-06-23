import React, { useState } from 'react';
import './SearchFeature.css';

function SearchFeature(props) {
	const [SearchTerms, setSearchTerms] = useState('');
	const onChangeSearch = (event) => {
		setSearchTerms(event.target.value);
		props.refreshFunction(event.target.value);
	};

	return (
		<div>
			<div className='search_box'>
				<input
					value={SearchTerms}
					onChange={onChangeSearch}
					placeholder='Find and share location updates as the world reopens. Enter location name here to get started...'
					type='text'
					element='input'
				/>
			</div>
			{/* </Card> */}
		</div>
	);
}

export default SearchFeature;
