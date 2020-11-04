import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	Image,
	ListGroup,
	Card,
	Button,
	ListGroupItem,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
} from 'react-bootstrap';
import Rating from '../../components/Rating';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { localDate } from '../../util/localDate';
import {
	listProductProfile,
	createProductReview,
} from '../../store/actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../../store/actions/actionTypes';

const Product = ({ history, match }) => {
	const prodId = match.params.id;

	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');

	const dispatch = useDispatch();

	const productProfile = useSelector((state) => state.productProfile);
	const { loading, error, product } = productProfile;

	const productReview = useSelector((state) => state.productReview);
	const { error: errorReview, success } = productReview;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (success) {
			alert('Review Submitted!');
			setRating(0);
			setComment('');
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
		}
		dispatch(listProductProfile(prodId));
	}, [dispatch, prodId, success]);

	const addToTrolleyHandler = () => {
		history.push(`/trolley/${prodId}?qty=${qty}`);
	};

	const submitReviewHandler = (e) => {
		e.preventDefault();
		dispatch(
			createProductReview(prodId, {
				rating,
				comment,
			})
		);
	};

	return (
		<>
			<Link className='btn btn-light my-3' to='/'>
				Return to Shop
			</Link>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Row>
						<Col md={6}>
							<Image src={product.image} alt={product.name} fluid />
						</Col>

						<Col md={3}>
							<ListGroup variant='flush'>
								<ListGroupItem>
									<h3>{product.name}</h3>
								</ListGroupItem>
								<ListGroupItem>
									<Rating
										value={product.rating}
										text={`${product.numReviews} reviews`}
										color='#F1C40F'
									/>
								</ListGroupItem>
								<ListGroupItem>
									<strong>£ {product.price}</strong>
								</ListGroupItem>
								<ListGroupItem>
									<strong>Description: {product.description}</strong>
								</ListGroupItem>
							</ListGroup>
						</Col>

						<Col md={3}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroupItem>
										<Row>
											<Col>Price:</Col>
											<Col>
												<strong>£ {product.price}</strong>
											</Col>
										</Row>
									</ListGroupItem>
									<ListGroupItem>
										<Row>
											<Col>Status:</Col>
											<Col>
												<strong>
													{product.countInStock > 0
														? 'In Stock'
														: 'Out of Stock'}
												</strong>
											</Col>
										</Row>
									</ListGroupItem>

									{product.countInStock > 0 && (
										<ListGroupItem>
											<Row>
												<Col>Quantity:</Col>
												<Col>
													<FormControl
														as='select'
														value={qty}
														onChange={(e) => setQty(e.target.value)}
													>
														{[...Array(product.countInStock).keys()]
															.slice(0, 10)
															.map((n) => (
																<option key={n + 1} value={n + 1}>
																	{n + 1}
																</option>
															))}
													</FormControl>
												</Col>
											</Row>
										</ListGroupItem>
									)}

									<ListGroupItem>
										<Button
											className='btn-block'
											type='button'
											disabled={product.countInStock === 0}
											onClick={addToTrolleyHandler}
										>
											ADD TO TROLLEY
										</Button>
									</ListGroupItem>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<h2>Product Reviews</h2>
							{product.reviews.length === 0 && <Message>No Reviews</Message>}
							<ListGroup variant='flush'>
								{product.reviews.map((rvw) => (
									<ListGroupItem key={rvw._id}>
										<strong>{rvw.name}</strong>
										<Rating value={rvw.rating} />
										<p>{localDate(rvw.createdAt)}</p>
										<p>{rvw.comment}</p>
									</ListGroupItem>
								))}
								<ListGroupItem>
									<h2>Write a Customer Review</h2>
									{errorReview && (
										<Message variant='secondary'>{errorReview}</Message>
									)}
									{userInfo ? (
										<Form onSubmit={submitReviewHandler}>
											<FormGroup controlId='rating'>
												<FormLabel>Rating</FormLabel>
												<FormControl
													as='select'
													value={rating}
													onChange={(e) => setRating(e.target.value)}
												>
													<option value=''>Please select</option>
													<option value='1'>1 - Poor</option>
													<option value='2'>2 - Fair</option>
													<option value='3'>3 - Good</option>
													<option value='4'>4 - Very Good</option>
													<option value='5'>5 - Excellent</option>
												</FormControl>
											</FormGroup>
											<FormGroup controlId='comment'>
												<FormLabel>Comment</FormLabel>
												<FormControl
													as='textarea'
													type='text'
													row='4'
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												></FormControl>
											</FormGroup>
											<Button variant='primary' type='submit'>
												Submit Review
											</Button>
										</Form>
									) : (
										<Message>
											Please{' '}
											<Link to='/login'>
												<strong>log in</strong>
											</Link>{' '}
											to write a review
										</Message>
									)}
								</ListGroupItem>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default Product;