import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import './PlaceList.css';

function PlaceList(props) {
	if (props.items.length === 0) {
		return (
			<div className='place-list center'>
				<Card>
					<h2>
						😔 No place updates found. Can you help others to social distance by
						adding one?
					</h2>
					<button>Share Place Updates</button>
				</Card>
			</div>
		);
	}

	return (
		<ul className='place-list'>
			{props.items.map((place) => (
				<PlaceItem
					key={place.id}
					id={place.id}
					image={place.imageUrl}
					title={place.title}
					description={place.description}
					address={place.address}
					creatorId={place.creator}
					coordinates={place.location} //object: lat & lng
				/>
			))}
		</ul>
	);
}

export default PlaceList;
