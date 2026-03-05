'use client'

import Carousel from '@/components/Carousel'

export default function Home() {
  return (
    <div>
      {/* Carousel */}
      <div className="container mt-4">
        <Carousel />
      </div>

      {/* Featured Content */}
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-lg-12">
            <h2 className="display-5 fw-bold mb-4">Featured Content</h2>
          </div>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {/* Card 1 */}
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 h-100" style={{ backgroundColor: '#2d2d2d' }}>
              <div
                style={{
                  backgroundColor: '#0d6efd',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-newspaper" style={{ fontSize: '48px', color: 'white' }}></i>
              </div>
              <div className="card-body">
                <h5 className="card-title text-light">Latest News</h5>
                <p className="card-text text-secondary">Stay updated with breaking news and important updates from RTM.</p>
                <button className="btn btn-primary btn-sm">Read More</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 h-100" style={{ backgroundColor: '#2d2d2d' }}>
              <div
                style={{
                  backgroundColor: '#198754',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-play-circle" style={{ fontSize: '48px', color: 'white' }}></i>
              </div>
              <div className="card-body">
                <h5 className="card-title text-light">Programs</h5>
                <p className="card-text text-secondary">Explore our diverse range of television and radio programs.</p>
                <button className="btn btn-success btn-sm">Browse</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 h-100" style={{ backgroundColor: '#2d2d2d' }}>
              <div
                style={{
                  backgroundColor: '#0dcaf0',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-people" style={{ fontSize: '48px', color: 'white' }}></i>
              </div>
              <div className="card-body">
                <h5 className="card-title text-light">Directory</h5>
                <p className="card-text text-secondary">Find contact information and staff directory listings here.</p>
                <button className="btn btn-info btn-sm">Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          backgroundColor: '#1a1a1a',
          padding: '60px 0',
          marginTop: '40px',
          borderTop: '1px solid #333',
          borderBottom: '1px solid #333'
        }}
      >
        <div className="container text-center">
          <h3 className="display-6 fw-bold mb-4 text-light">Join Us Today</h3>
          <p className="lead text-secondary mb-4">Subscribe to get the latest news and updates delivered to your inbox.</p>
          <button className="btn btn-primary btn-lg">Subscribe Now</button>
        </div>
      </div>
    </div>
  )
}
