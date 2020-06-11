import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

// this component is only for internal use
function ModalOverlay(props) {
	// template literals & props for extra className styling flexibility
	const content = (
		<div className={`modal ${props.className}`} style={props.style}>
			<header className={`modal__header ${props.headerClass}`}>
				<h2>{props.header}</h2>
			</header>
			<form
				onSubmit={
					//check if there is fcn for onSubmit, or else just preventDefault
					props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
				}>
				<div className={`modal__content ${props.contentClass}`}>
					{props.children}
				</div>
				<footer className={`modal__footer ${props.footerClass}`}>
					{props.footer}
				</footer>
			</form>
		</div>
	);
	return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
}

function Modal(props) {
	return (
		<React.Fragment>
			{props.show && <Backdrop onClick={props.onCancel} />}
			<CSSTransition
				in={props.show}
				mountOnEnter
				unmountOnExit
				timeout={200}
				classNames='modal'>
				{/* forward all Modal props to ModalOverlay */}
				<ModalOverlay {...props} />
			</CSSTransition>
		</React.Fragment>
	);
}

export default Modal;
