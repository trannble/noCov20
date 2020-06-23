import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook.js';
import './PlaceItem.css';

function PlaceItem(props) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [showMap, setShowMap] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	function openMapHandler() {
		setShowMap(true);
	}

	function closeMapHandler() {
		setShowMap(false);
	}

	function showDeleteWarningHandler() {
		setShowConfirmModal(true);
	}

	function cancelDeleteHandler() {
		setShowConfirmModal(false);
	}

	async function confirmDeleteHandler() {
		setShowConfirmModal(false);
		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
				'DELETE',
				//no body or headers for delete requests
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			//trigger userPlaces reload to remove deleted place
			props.onDelete(props.id);
		} catch (err) {}
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass='place-item__modal-content'
				footerClass='place-item__modal-actions'
				footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
				<div className='map-container'>
					{/* render more info & change button name - i.e. other people's comments */}
					<Map center={props.coordinates} zoom={15} />
				</div>
			</Modal>
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header='Are you sure?'
				footerClass='place-item__modal-actions'
				footer={
					<React.Fragment>
						<Button inverse onClick={cancelDeleteHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteHandler}>
							DELETE
						</Button>
					</React.Fragment>
				}>
				<p>
					Do you want to PERMANENTLY DELETE this location? This action cannot be
					undone.
				</p>
			</Modal>

			<li className='place-item'>
				<Card className='place-item__content'>
					{isLoading && <LoadingSpinner asOverlay />}
					{/* <div className='place-item__image'>
						<img src={props.image} alt={props.title} />
					</div> */}
					<div className='place-item__info'>
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className='place-item__actions'>
						<Button inverse onClick={openMapHandler}>
							VIEW ON MAP
						</Button>
						{auth.userId === props.creatorId && (
							<Button to={`/places/${props.id}`}>EDIT</Button>
						)}
						{auth.userId === props.creatorId && (
							<Button danger onClick={showDeleteWarningHandler}>
								DELETE
							</Button>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
}

export default PlaceItem;
