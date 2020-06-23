import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Users.css';

const Users = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedUsers, setLoadedUsers] = useState();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const responseData = await sendRequest(
					//change to ENV
					process.env.REACT_APP_BACKEND_URL + '/users'
				);

				setLoadedUsers(responseData.users);
			} catch (err) {}
		};
		fetchUsers();
	}, [sendRequest]);

	return (
		<React.Fragment>
			<h className='slogan'>
				Together we can maintain a safe community and save lives.
			</h>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
		</React.Fragment>
	);
};

export default Users;
