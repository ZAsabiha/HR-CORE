import React, { useState } from 'react';
import './PerformanceReview.css';
import { User, Star, MessageCircle, Calendar, PlusCircle } from 'lucide-react';

const PerformanceReview = () => {

  const [reviews, setReviews] = useState([]);


  const [reviewData, setReviewData] = useState({
    employeeId: '',
    rating: 0,
    feedback: '',
    reviewDate: new Date().toISOString().split('T')[0], 


  const [filter, setFilter] = useState({
    department: '',
    month: '',
    rating: '',
  });

  // State to control visibility of the review form
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch reviews from backend when component loads or filters change
  React.useEffect(() => {
    const fetchReviews = async () => {
      let query = '';
      if (filter.department) query += `department=${filter.department}&`;
      if (filter.month) query += `month=${filter.month}&`;
      if (filter.rating) query += `rating=${filter.rating}&`;

      const response = await fetch(`/api/reviews?${query}`);
      const data = await response.json();
      setReviews(data);
    };

    fetchReviews();
  }, [filter]);

  // Handle input change for the review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAddReview = () => {
    const { employeeId, rating, feedback, reviewDate } = reviewData;

    if (!employeeId || !rating || !feedback || !reviewDate) {
      alert('Please fill in all fields!');
      return;
    }

    const newReview = {
      employeeId: parseInt(employeeId),
      rating: parseFloat(rating),
      feedback,
      reviewDate,
    };

    // Send POST request to backend
    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    })
      .then((res) => res.json())
      .then((addedReview) => {
       
        setReviews((prevReviews) => [...prevReviews, addedReview]);
        
        setReviewData({
          employeeId: '',
          rating: 0,
          feedback: '',
          reviewDate: new Date().toISOString().split('T')[0],
        });
      
        setShowReviewForm(false);
      })
      .catch((err) => console.error('Error adding review:', err));
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <h2 className="review-title">Employee Performance Reviews</h2>
        <button className="add-review-btn" onClick={() => setShowReviewForm(true)}>
          <PlusCircle size={18} /> Add Review
        </button>
      </div>

      {/* Show form only when 'showReviewForm' is true */}
      {showReviewForm && (
        <div className="review-form">
          <div>
            <label>Employee ID:</label>
            <input
              type="number"
              name="employeeId"
              value={reviewData.employeeId}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Rating:</label>
            <input
              type="number"
              name="rating"
              value={reviewData.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
            />
          </div>

          <div>
            <label>Feedback:</label>
            <textarea
              name="feedback"
              value={reviewData.feedback}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Review Date:</label>
            <input
              type="date"
              name="reviewDate"
              value={reviewData.reviewDate}
              onChange={handleInputChange}
            />
          </div>

          <button onClick={handleAddReview}>Submit Review</button>
          <button onClick={() => setShowReviewForm(false)}>Cancel</button>
        </div>
      )}

      {/* Filter Section */}
      <div className="filter-section">
        <label>Department:</label>
        <input
          type="text"
          name="department"
          value={filter.department}
          onChange={handleFilterChange}
        />

        <label>Month (YYYY-MM):</label>
        <input
          type="text"
          name="month"
          value={filter.month}
          onChange={handleFilterChange}
        />

        <label>Rating:</label>
        <input
          type="number"
          name="rating"
          value={filter.rating}
          onChange={handleFilterChange}
        />

        <button onClick={() => setFilter({ department: '', month: '', rating: '' })}>
          Reset Filters
        </button>
      </div>

      {/* Reviews List */}
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-row">
              <User className="icon" size={16} /> <span className="label">Name:</span> {review.employee?.name}
            </div>
            <div className="review-row">
              <span className="label">Department:</span> {review.employee?.department?.name}
            </div>
            <div className="review-row">
              <Star className="icon" size={16} /> <span className="label">Rating:</span> ⭐ {review.rating}
            </div>
            <div className="review-row">
              <MessageCircle className="icon" size={16} /> <span className="label">Feedback:</span> {review.feedback}
            </div>
            <div className="review-row">
              <Calendar className="icon" size={16} /> <span className="label">Date:</span> {review.reviewDate}
            </div>
            <button>Edit</button> {/* Implement edit functionality */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceReview;

