import { useState, useCallback, useEffect } from 'react';

//outside bc not a data loaded directly in component
let logoutTimer;

export const useAuth = () => {
	const [token, setToken] = useState(false);
	const [userId, setUserId] = useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();

	const login = useCallback((uid, token, expirationDate) => {
		setToken(token);
		setUserId(uid);
		//date = preloaded time from refresh or one hour in future
		const tokenExpirationDate =
			expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		//store in browser local storage to stay log in when refresh
		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: uid,
				token: token,
				expiration: tokenExpirationDate.toISOString(),
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			//time left in token after refresh in miliseconds
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			//no token time - clear timer. log in new - new timer.
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	//only reloads when login fcn reruns - new userId
	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expiration) > new Date()
		) {
			login(storedData.userId, storedData.token);
		}
	}, [login]);

	return { token, login, logout, userId };
};
