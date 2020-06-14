import { createContext } from 'react';

// creates an object containing some data that can be shared to all components
// createContext mech built into React
// export to App.js
export const AuthContext = createContext({
	isLoggedIn: false,
	login: () => {},
	logout: () => {},
});
