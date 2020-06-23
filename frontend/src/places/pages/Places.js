import React, { useState } from 'react';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import SearchFeature from '../components/SearchFeature';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Places.css';

const Places = () => {
	//home page and search bar

	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedPlaces, setLoadedPlaces] = useState();

	async function fetchPlaces(title) {
		try {
			const responseData = await sendRequest(
				process.env.REACT_APP_BACKEND_URL + `/places?title=${title}`
			);

			setLoadedPlaces(responseData.places);
		} catch (err) {}
	}

	const [SearchTerms, setSearchTerms] = useState('');

	const updateSearchTerms = (newSearchTerm) => {
		setSearchTerms(newSearchTerm);

		fetchPlaces(SearchTerms);
	};

	return (
		<React.Fragment>
			<div className='wrapper'>
				<SearchFeature refreshFunction={updateSearchTerms} />

				<ErrorModal error={error} onClear={clearError} />

				{isLoading && (
					<div className='center'>
						<LoadingSpinner />
					</div>
				)}
				{!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
			</div>
		</React.Fragment>
	);
};

export default Places;
