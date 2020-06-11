import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'Golden Gate Bridge',
		description:
			'I went here on 6/1 and there were so many people. Barely any room to walk/run and social distance. If you are looking for an outdoor location to go, I do not recommend here',
		imageUrl: 'https://geekologie.com/2020/06/08/golden-gate-bridge.jpg',
		address: 'Golden Gate Bridge, San Francisco, CA',
		location: {
			lat: 37.8199286,
			lng: -122.4782551,
		},
		creator: 'u1',
	},
	{
		id: 'p2',
		title: 'Golden Gate Bridge',
		description:
			'I went here on 6/1 and there were so many people. Barely any room to walk/run and social distance. If you are looking for an outdoor location to go, I do not recommend here',
		imageUrl: 'https://geekologie.com/2020/06/08/golden-gate-bridge.jpg',
		address: 'Golden Gate Bridge, San Francisco, CA',
		location: {
			lat: 37.8199286,
			lng: -122.4782551,
		},
		creator: 'u2',
	},
];

function UserPlaces(props) {
	// get userId and filter to own their own inputs
	const userId = useParams().userId;
	const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
	return <PlaceList items={loadedPlaces} />;
}

export default UserPlaces;
