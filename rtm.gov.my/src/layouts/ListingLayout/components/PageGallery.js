import React, { useState, useEffect } from 'react';

import axios from 'axios';


const ShowGallery = ({ article_data_id }) => {

  const url = process.env.REACT_APP_API_URL + '/article-galleries/' + article_data_id;
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const path = `${serverUrl}/storage/article_galleries`;

  const [dimensions, setDimensions] = useState({});
  const [modalInfo, setModalInfo] = useState({ show: false, src: '', width: 0, height: 0 });

  const handleImageLoad = (event, index) => {
    const { naturalWidth, naturalHeight } = event.target;
    setDimensions(prev => ({
      ...prev,
      [index]: { width: naturalWidth, height: naturalHeight }
    }));
  };

  const handleImageClick = (src, width, height) => {
    setModalInfo({ show: true, src, width, height });
  };

  const handleClose = () => {
    setModalInfo({ show: false, src: '', width: 0, height: 0 });
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: url
    })
      .then(response => {
        setRefresh(false);
        setItems(response.data.article_galleries);
      })
      .catch(error => {
        console.warn(error);
      });
  }, [refresh]);

  return (
    <div>
      <div className="row mt-3 d-flex justify-content-center">
        {items?.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            {item.filename && /\.(jpg|gif|png)$/.test(item.filename) ? (
              <figure>
                <img
                  src={`${path}/${item.filename}`}
                  alt="Image"
                  className="img-fluid rounded"
                  onLoad={(e) => handleImageLoad(e, index)}
                  onClick={() => handleImageClick(`${path}/${item.filename}`, dimensions[index]?.width, dimensions[index]?.height)}
                  style={{ cursor: 'pointer' }}
                />
                {/* <figcaption>
                  {`Width: ${dimensions[index]?.width || '-'} px, Height: ${dimensions[index]?.height || '-'} px`}
                </figcaption> */}
              </figure>
            ) : (
              <div>Not an image</div>
            )}
          </div>
        ))}
      </div>

      {modalInfo.show && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          role="dialog" 
          aria-hidden="true" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered" 
            role="document"
            style={{ border: 'none' }} // Remove the border
          >
            <div 
              className="modal-content" 
              style={{ 
                backgroundColor: 'transparent', // Make background transparent
                border: 'none' // Remove border from modal content as well
              }}
            >
              <div className="modal-header">
                <button 
                  type="button" 
                  className="close" 
                  onClick={handleClose} 
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img
                  src={modalInfo.src}
                  alt="Full Image"
                  style={{ width: `${modalInfo.width}px`, height: `${modalInfo.height}px` }}
                  className="img-fluid"
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ShowGallery;
