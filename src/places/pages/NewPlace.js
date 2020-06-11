import React, { useCallback, useReducer } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/util/validator';
import './NewPlace.css';

function formReducer(state, action) {
	// update state when action taken
	switch (action.type) {
		case 'INPUT_CHANGE':
			let formIsValid = true;
			for (const inputId in state.inputs) {
				// one false anywhere = overall form is false
				if (inputId === action.inputId) {
					formIsValid = formIsValid && action.isValid;
				} else {
					formIsValid = formIsValid && state.inputs[inputId].isValid;
				}
			}
			return {
				...state,
				input: {
					...state.inputs,
					[action.inputId]: { value: action.value, isValid: action.isValid },
				},
				isValid: formIsValid,
			};
		default:
			return state;
	}
}

function NewPlace() {
	// initial state
	const [formState, dispatch] = useReducer(formReducer, {
		// validity of individual parts
		inputs: {
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
		},
		// validity of entire form
		isValid: false,
	});

	const inputHandler = useCallback((id, value, isValid) => {
		dispatch({
			type: 'INPUT_CHANGE',
			value: value,
			isValid: isValid,
			inputId: id,
		});
	}, []);

	return (
		<form className='place-form'>
			<Input
				id='title'
				element='input'
				type='text'
				label='Title'
				// check user input is not empty
				validators={[VALIDATOR_REQUIRE()]}
				errorText='Please enter a valid location name.'
				onInput={inputHandler}
			/>
			<Input
				id='description'
				element='textarea'
				label='Description'
				row='10'
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText='Please enter an update about the location with at least 5 characters.'
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
