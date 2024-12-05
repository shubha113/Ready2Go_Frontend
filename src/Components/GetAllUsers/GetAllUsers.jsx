import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, verifyDocument } from '../../Redux/actions/jobAction';
import { 
  UserCircle, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Filter,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from 'lucide-react';
import './GetAllUsers.css';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const { documentVerificationLoading } = useSelector(state => state.job || {});

  const renderIcon = (role) => {
    switch(role) {
      case 'driver': return <Truck className="role-icon driver" />;
      case 'company': return <Building2 className="role-icon company" />;
      default: return <UserCircle className="role-icon default" />;
    }
  };

  const renderVerificationStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleDocumentVerification = (documentType, status) => {
    dispatch(verifyDocument(user._id, documentType, status));
  };

  const renderDriverDetails = () => {
    if (!isExpanded || user?.basicInfo?.role !== 'driver') return null;

    return (
      <div className="driver-details">
        <div className="border-t">
          <h4>Verification Status</h4>
          <div className="grid">
            {Object.entries(user.verificationStatus || {}).map(([key, value]) => (
              <p key={key}>
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>: 
                <span className={renderVerificationStatusColor(value)}> {value}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="border-t">
          <h4>Documents</h4>
          <div className="documents-grid">
            {Object.entries(user.documents || {})
              .filter(([_, docs]) => docs.length > 0)
              .map(([docType, docUrls]) => (
                <div key={docType} className="document-section">
                  <p className="capitalize">{docType.replace(/([A-Z])/g, ' $1')}</p>
                  {docUrls.map((url, index) => (
                    <div key={index} className="document-verify-container">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="document-link"
                      >
                        View Document {index + 1}
                      </a>
                      {user?.basicInfo?.role === 'driver' && (
                        <div className="document-verify-actions">
                          <button 
                            className={`verify-btn verify ${
                              user.verificationStatus[docType] === 'verified' 
                                ? 'active' 
                                : ''
                            }`}
                            onClick={() => handleDocumentVerification(docType, 'verified')}
                            disabled={documentVerificationLoading}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className={`verify-btn reject ${
                              user.verificationStatus[docType] === 'rejected' 
                                ? 'active' 
                                : ''
                            }`}
                            onClick={() => handleDocumentVerification(docType, 'rejected')}
                            disabled={documentVerificationLoading}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        {renderIcon(user?.basicInfo?.role || 'default')}
        <h3>{user?.basicInfo?.name || 'Unknown User'}</h3>
        <span className={`verification-badge ${user?.accountStatus?.isVerified ? 'verified' : 'unverified'}`}>
          {user?.accountStatus?.isVerified ? 'Verified' : 'Unverified'}
        </span>
        {user?.basicInfo?.role === 'driver' && (
          <div 
            className="expand-toggle" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        )}
      </div>
      <div className="user-card-body">
        <div className="user-details">
          <p><strong>Email:</strong> {user?.basicInfo?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {user?.basicInfo?.phoneNumber || 'N/A'}</p>
          <p><strong>Role:</strong> {user?.basicInfo?.role || 'N/A'}</p>
        </div>
        <div className="user-status">
          <div className="status-item">
            <ShieldCheck style={{color: "#DB2777"}} />
            <span>Overall Status: {user?.accountStatus?.overallVerificationStatus || 'N/A'}</span>
          </div>
        </div>
      </div>
      {renderDriverDetails()}
    </div>
  );
};

const GetAllUsers = () => {
  const dispatch = useDispatch();
  const { 
    users = [], 
    loading = false, 
    error = null, 
    totalPages = 1 
  } = useSelector(state => state.job || {});
  
  const [filters, setFilters] = useState({
    role: '',
    verificationStatus: '',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    dispatch(getAllUsers(filters));
  }, [dispatch, JSON.stringify(filters)]);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="users-management-container">
      <div className="users-header">
        <h1>User Management</h1>
        <div className="filters">
          <Filter size={24} />
          <select 
            value={filters.role} 
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="driver">Drivers</option>
            <option value="company">Companies</option>
          </select>
          <select 
            value={filters.verificationStatus} 
            onChange={(e) => setFilters(prev => ({ ...prev, verificationStatus: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : users.length === 0 ? (
        <div className="no-users">No users found</div>
      ) : (
        <>
          <div className="users-grid">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                onClick={() => handlePageChange(page)}
                className={page === filters.page ? 'active' : ''}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GetAllUsers;