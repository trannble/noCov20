import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// get place id from URL

import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/util/validator';
import { useForm } from '../../shared/hooks/form-hooks';
import './PlaceForm.css';

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

function UpdatePlace() {
	const [isLoading, setIsLoading] = useState(true);
	const placeId = useParams().placeId;

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);

	// update form data when dependencies change
	useEffect(() => {
		if (identifiedPlace) {
			setFormData(
				{
					title: {
						value: identifiedPlace.title,
						isValid: true,
					},
					description: {
						value: identifiedPlace.description,
						isValid: true,
					},
				},
				true
			);
		}

		setIsLoading(false);
	}, [setFormData, identifiedPlace]);

	function placeUpdateSubmitHandler(event) {
		event.preventDefault();
		console.log(formState.inputs);
	}

	if (!identifiedPlace) {
		return (
			<div className='center'>
				<Card>
					<h2>Could not find place!</h2>
				</Card>
				{/* backend handling later */}
			</div>
		);
	}

	// if no title found - will fix later w http
	if (isLoading) {
		return (
			<div className='center'>
				<h2>Loading...</h2>
			</div>
		);
	}

	return (
		<form className='place-form' onSubmit={placeUpdateSubmitHandler}>
			<Input
				id='title'
				element='input'
				type='text'
				label='Location Name'
				validators={[VALIDATOR_REQUIRE()]}
				errorText='Please enter a valid location title.'
				onInput={inputHandler}
				initialValue={formState.inputs.title.value}
				initialValid={formState.inputs.title.isValid}
			/>
			<Input
				id='description'
				element='textarea'
				row='10'
				label='Update'
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText='Please enter a valid description (min of 5 characters).'
				onInput={inputHandler}
				initialValue={formState.inputs.description.value}
				initialValid={formState.inputs.description.isValid}
			/>
			<Button type='submit' disabled={!formState.isValid}>
				UPDATE PLACE
			</Button>
		</form>
	);
}

export default UpdatePlace;
