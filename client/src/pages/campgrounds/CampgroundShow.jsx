import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCampground, deleteCampground } from '../../api/campgrounds';
import { deleteReview } from '../../api/reviews';
import ReviewForm from '../../components/ReviewForm';
import { useFlash } from '../../context/FlashContext';
import { useAuth } from '../../context/AuthContext';

const CampgroundShow = () => {
  const [campground, setCampground] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { showFlash } = useFlash();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleReviewAdded = (newReview) => {
    setCampground(prev => ({
      ...prev,
      reviews: [...prev.reviews, newReview]
    }));
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const response = await deleteReview(id, reviewId);
      showFlash(response.message, 'success');
      setCampground(prev => ({
        ...prev,
        reviews: prev.reviews.filter(review => review._id !== reviewId)
      }));
    } catch (error) {
      showFlash('Erro ao remover review.', 'error');
    }
  };

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const data = await getCampground(id);
        setCampground(data);
      } catch (error) {
        showFlash('Não foi possível encontrar este acampamento!', 'error');
        navigate('/campgrounds');
      } finally {
        setLoading(false);
      }
    };
    fetchCampground();
  }, [id, showFlash, navigate]);

  const handleDelete = async () => {
    try {
      await deleteCampground(id);
      showFlash('O acampamento foi removido com sucesso!', 'success');
      navigate('/campgrounds');
    } catch (error) {
      showFlash('Erro ao remover acampamento.', 'error');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!campground) {
    return null;
  }

  const isAuthor = currentUser && campground.author && campground.author._id === currentUser._id;

  return (
    <div className="row">
      <div className="col-6">
        <div className="card mb-3">
          {campground.images && campground.images.length > 0 && (
            <img src={campground.images[0].url} className="card-img-top" alt="..." />
          )}
          <div className="card-body">
            <h5 className="card-title">{campground.title}</h5>
            <p className="card-text">{campground.description}</p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item text-muted">{campground.location}</li>
            <li className="list-group-item">Submitted by {campground.author.username}</li>
            <li className="list-group-item">${campground.price}</li>
          </ul>
          {isAuthor && (
            <div className="card-body">
              <Link className="card-link btn btn-info" to={`/campgrounds/${campground._id}/edit`}>
                Edit
              </Link>
              <button className="card-link btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
          <div className="card-footer text-muted">2 days ago</div>
        </div>
      </div>
      <div className="col-6">
        {currentUser && <ReviewForm campgroundId={campground._id} onReviewAdded={handleReviewAdded} />}
        <hr />
        <h2>Reviews</h2>
        {campground.reviews.map(review => (
            <div key={review._id} className="card mb-3">
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">By {review.author.username}</h6>
                    <p className="card-text">Rating: {review.rating}</p>
                    <p className="card-text">{review.body}</p>
                    {currentUser && review.author._id === currentUser._id && (
                        <button className="btn btn-sm btn-danger" onClick={() => handleReviewDelete(review._id)}>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CampgroundShow;
