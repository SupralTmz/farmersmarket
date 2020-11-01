import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormWrap from '../components/Form';
import { saveDeliveryAddress } from '../store/actions/trolleyActions';
import CheckoutSteps from '../components/CheckoutSteps';

import {
	Button,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
} from 'react-bootstrap';

const Delivery = ({ history }) => {
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [postcode, setPostcode] = useState('');

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(saveDeliveryAddress({ address, city, postcode }));
		history.push('/payment');
	};

	return (
		<FormWrap>
			<CheckoutSteps step1 step2 />
			<h1>DELIVERY</h1>
			<Form onSubmit={submitHandler}>
				<FormGroup controlId='address'>
					<FormLabel>Address:</FormLabel>
					<FormControl
						type='text'
						placeholder='Enter address'
						value={address}
						required
						onChange={(e) => setAddress(e.target.value)}
					/>
				</FormGroup>

				<FormGroup controlId='city'>
					<FormLabel>City:</FormLabel>
					<FormControl
						type='text'
						placeholder='Enter city'
						value={city}
						required
						onChange={(e) => setCity(e.target.value)}
					/>
				</FormGroup>

				<FormGroup controlId='postcode'>
					<FormLabel>Postcode:</FormLabel>
					<FormControl
						type='text'
						placeholder='Enter postcode'
						value={postcode}
						required
						onChange={(e) => setPostcode(e.target.value)}
					/>
				</FormGroup>

				<Button variant='primary' type='submit'>
					Continue to Payment
				</Button>
			</Form>
		</FormWrap>
	);
};

export default Delivery;