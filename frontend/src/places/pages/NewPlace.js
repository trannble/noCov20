import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/util/validator';
import { useForm } from '../../shared/hooks/form-hooks';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

function NewPlace() {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	//useForm (initialInputs, initialFormValidity)
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			address: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const history = useHistory();

	async function placeSubmitHandler(event) {
		event.preventDefault();
		try {
			// send to backend
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL + '/places',
				'POST',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
					address: formState.inputs.address.value,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
			//Redirect user back to home page
			history.push('/');
		} catch (err) {}
	}

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<form className='place-form' onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='title'
					element='input'
					type='text'
					label='Location Name'
					// check user input is not empty
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid location name.'
					onInput={inputHandler}
					placeholder='E.g. San Francisco Golden Gate Bridge'
				/>
				<Input
					id='description'
					element='textarea'
					label='Updates'
					row='10'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter an update about the location with at least 5 characters.'
					onInput={inputHandler}
					placeholder='When I went here on 6/22/20 and there were too many people and not enough room to social distance...'
				/>
				<Input
					id='address'
					element='input'
					label='Address'
					validators={[VALIDATOR_REQUIRE()]}
					// will check if address exist on backend
					errorText='Please enter a valid address.'
					onInput={inputHandler}
					placeholder='Street Address, Apt/Suite/Other, City, State, ZIP Code'
				/>
				{/* when form validity is false -> disable submit button */}
				<Button type='submit' disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</React.Fragment>
	);
}

export default NewPlace;
