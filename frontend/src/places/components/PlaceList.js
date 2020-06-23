import React, { useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import PlaceItem from './PlaceItem';
import './PlaceList.css';
import { AuthContext } from '../../shared/context/auth-context';
import { useParams } from 'react-router-dom';

function PlaceList(props) {
	const { uid, isLoggedIn } = useContext(AuthContext);
	const userId = useParams().userId;

	if (props.items.length === 0) {
		return (
			<div className='place-list center'>
				<Card>
					<h2>
						No place found. Can you help others to social distance by adding
						one?
					</h2>
					<Button to='/places/new'>Share Place</Button>
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
					// image={place.image}
					title={place.title}
					description={place.description}
					address={place.address}
					creatorId={place.creator}
					coordinates={place.location} //object: lat & lng
					onDelete={props.onDeletePlace}
				/>
			))}
		</ul>
	);
}

export default PlaceList;
