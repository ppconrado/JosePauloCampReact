// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getCampgrounds } from '../../api/campgrounds';
// import { useFlash } from '../../context/FlashContext';

// const CampgroundIndex = () => {
//   const [campgrounds, setCampgrounds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { showFlash } = useFlash();

//   useEffect(() => {
//     const fetchCampgrounds = async () => {
//       try {
//         const data = await getCampgrounds();
//         setCampgrounds(data);
//       } catch (error) {
//         showFlash('Erro ao carregar acampamentos.', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCampgrounds();
//   }, [showFlash]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>All Campgrounds</h1>
//       {campgrounds.map((campground) => (
//         <div className="card mb-3" key={campground._id}>
//           <div className="row">
//             <div className="col-md-4">
//               {campground.images && campground.images.length > 0 && (
//                 <img
//                   className="img-fluid"
//                   alt=""
//                   src={campground.images[0].url}
//                   style={{ width: '100%', height: '200px', objectFit: 'cover' }}
//                 />
//               )}
//             </div>
//             <div className="col-md-8">
//               <div className="card-body">
//                 <h5 className="card-title">{campground.title}</h5>
//                 <p className="card-text">{campground.description.substring(0, 100)}...</p>
//                 <p className="card-text">
//                   <small className="text-muted">{campground.location}</small>
//                 </p>
//                 <Link to={`/campgrounds/${campground._id}`} className="btn btn-primary">
//                   View {campground.title}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CampgroundIndex;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCampgrounds } from '../../api/campgrounds';
import { useFlash } from '../../context/FlashContext';

const CampgroundIndex = () => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showFlash } = useFlash();

  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        const data = await getCampgrounds();
        setCampgrounds(Array.isArray(data) ? data : []);
      } catch (error) {
        showFlash(error.message || 'Erro ao carregar acampamentos.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCampgrounds();
  }, [showFlash]);

  if (loading) {
    return <div className="text-center">Carregando acampamentos...</div>;
  }

  if (!campgrounds.length) {
    return <div className="text-center">Nenhum acampamento encontrado.</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Todos os Acampamentos</h1>
      {campgrounds.map((campground) => (
        <div className="card mb-3" key={campground._id}>
          <div className="row g-0">
            <div className="col-md-4">
              {campground.images && campground.images.length > 0 ? (
                <img
                  className="img-fluid rounded-start"
                  alt={campground.title}
                  src={campground.images[0].url}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="placeholder-image bg-secondary"
                  style={{ height: '200px' }}
                />
              )}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{campground.title}</h5>
                <p className="card-text">
                  {campground.description?.substring(0, 100)}...
                </p>
                <p className="card-text">
                  <small className="text-muted">{campground.location}</small>
                </p>
                <Link
                  to={`/campgrounds/${campground._id}`}
                  className="btn btn-primary"
                >
                  Ver {campground.title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampgroundIndex;
