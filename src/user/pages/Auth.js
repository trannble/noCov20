import React, { useState, useContext } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/hooks/form-hooks';
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

	function authSubmitHandler(event) {
		event.preventDefault();
		console.log(formState.inputs);
		auth.login();
	}

	return (
		<Card className='authentication'>
			<h2 className='authentication__header'>
				👋 Share your experience. Help others social distance.
			</h2>
			<hr />
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
	);
}

export default Auth;
