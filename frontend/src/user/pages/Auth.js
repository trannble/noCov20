import React, { useState, useContext } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hooks';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_EMAIL,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validator';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

function Auth() {
	const auth = useContext(AuthContext);

	// to switch between login & signup
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	// original validity state of form
	const [formState, inputHandler, setFormData] = useForm({
		email: {
			value: '',
			isValid: false,
		},
		password: {
			value: '',
			isValid: false,
		},
	});

	function switchModeHandler() {
		if (!isLoginMode) {
			// switching from signup -> login
			setFormData(
				{
					...formState.inputs,
					name: undefined, //input will be skipped in form-hook
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			// switching login -> signup (first false b/c just added name field)
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false,
					},
				},
				false
			);
		}
		// switch happens here
		setIsLoginMode((prevMode) => !prevMode);
	}

	async function authSubmitHandler(event) {
		event.preventDefault();

		if (isLoginMode) {
			//send http request w/ built in API
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/users/login',
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {
				//handling in custom hook
			}
		} else {
			try {
				//send http request w/ built in API
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/users/signup',
					'POST',
					JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);

				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		}
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className='authentication'>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2 className='authentication__header'>
					Join to share your experience.
				</h2>
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element='input'
							id='name'
							type='text'
							label='Name'
							validators={[VALIDATOR_REQUIRE()]}
							errorText='Please enter a name.'
							onInput={inputHandler}
						/>
					)}
					<Input
						id='email'
						element='input'
						type='email'
						label='Email'
						validators={[VALIDATOR_EMAIL()]}
						errorText='Please enter a valid email address.'
						onInput={inputHandler}
					/>
					<Input
						id='password'
						element='input'
						type='password'
						label='Password'
						validators={[VALIDATOR_MINLENGTH(7)]}
						errorText='Please enter a strong password of at least 7 characters.'
						onInput={inputHandler}
					/>
					<Button type='submit' disabled={!formState.isValid}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
}

export default Auth;
