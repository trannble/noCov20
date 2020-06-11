import React from 'react';

import UsersList from '../components/UsersList';

function Users() {
	// will fetch user from database
	const USERS = [
		{
			id: 'u1',
			name: 'Jane Doe',
			image:
				'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png',
			places: 3,
		},
	];

	return <UsersList items={USERS} />;
}

export default Users;
