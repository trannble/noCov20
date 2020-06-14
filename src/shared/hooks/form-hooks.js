import { useCallback, useReducer } from 'react';

function formReducer(state, action) {
	// update state when action taken
	switch (action.type) {
		case 'INPUT_CHANGE':
			let formIsValid = true;
			for (const inputId in state.inputs) {
				// if a state input (ex. name input on login) is false -> skip & continue to checking next input
				if (!state.inputs[inputId]) {
					continue;
				}
				// one false anywhere = overall form is false
				if (inputId === action.inputId) {
					formIsValid = formIsValid && action.isValid;
				} else {
					formIsValid = formIsValid && state.inputs[inputId].isValid;
				}
			}
			return {
				...state,
				inputs: {
					...state.inputs,
					[action.inputId]: { value: action.value, isValid: action.isValid },
				},
				isValid: formIsValid,
			};
		case 'SET_DATA':
			return {
				inputs: action.inputs,
				isValid: action.formIsValid,
			};
		default:
			return state;
	}
}

// note export here!! -- not default like components
// can now use hooks inside of other components + less code! (newPlace, updatePlace)
export function useForm(initialInputs, initialFormValidity) {
	const [formState, dispatch] = useReducer(formReducer, {
		// validity of individual parts
		inputs: initialInputs,
		// validity of entire form
		isValid: initialFormValidity,
	});

	const inputHandler = useCallback((id, value, isValid) => {
		dispatch({
			type: 'INPUT_CHANGE',
			value: value,
			isValid: isValid,
			inputId: id,
		});
	}, []);

	// replace values and validity stored in form
	const setFormData = useCallback((inputData, formValidity) => {
		dispatch({
			type: 'SET_DATA', //can use any identifier i want
			inputs: inputData,
			formIsValid: formValidity,
		});
	}, []); //no dependencies = never recreated

	return [formState, inputHandler, setFormData];
}
