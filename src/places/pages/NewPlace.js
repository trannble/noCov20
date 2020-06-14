import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/util/validator';
import { useForm } from '../../shared/hooks/form-hooks';
import './PlaceForm.css';

function NewPlace() {
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

	function placeSubmitHandler(event) {
		event.preventDefault();
		console.log(formState.inputs);
		// send to backend
	}

	return (
		<form className='place-form' onSubmit={placeSubmitHandler}>
			<Input
				id='title'
				element='input'
				type='text'
				label='Location Name'
				// check user input is not empty
				validators={[VALIDATOR_REQUIRE()]}
				errorText='Please enter a valid location name.'
				onInput={inputHandler}
			/>
			<Input
				id='description'
				element='textarea'
				label='Updates'
				row='10'
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText='Please enter an update about the location with at least 5 characters.'
				onInput={inputHandler}
			/>
			<Input
				id='address'
				element='input'
				label='Address'
				validators={[VALIDATOR_REQUIRE()]}
				// will check if address exist on backend
				errorText='Please enter a valid address.'
				onInput={inputHandler}
			/>
			{/* when form validity is false -> disable submit button */}
			<Button type='submit' disabled={!formState.isValid}>
				ADD PLACE
			</Button>
		</form>
	);
}

export default NewPlace;
