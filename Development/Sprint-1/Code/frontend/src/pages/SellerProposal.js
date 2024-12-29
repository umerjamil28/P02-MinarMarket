import React, { useState, useEffect } from 'react';
import BuyerSidebar from '../components/BuyerSidebar';
import SellerSidebar from '../components/SellerSidebar';
import { getUserDetails } from '../components/SessionManager';
import SellerDashboardNavbar from '../components/SellerDashboardNavbar';


const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userDetails = getUserDetails();
  

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/proposals/seller`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userDetails.userId })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }

        const data = await response.json();
        setProposals(data.proposals || []);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails?.userId) {
      fetchProposals();
    }
  }, [ userDetails?.userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerDashboardNavbar />
      <div className="flex">
        {<SellerSidebar />}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">
              Sent Proposals
          </h1>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading proposals...</p>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center py-4">
              Error: {error}
            </div>
          )}

          {!loading && !error && proposals.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No proposals found</p>
            </div>
          )}

          <div className="grid gap-6">
            {proposals.map((proposal) => (
              <div 
                key={proposal._id} 
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {proposal.requirementId?.title || 'No Title'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {`From: ${proposal.sellerId?.name || 'Unknown Seller'}`}
                    </p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}
                  `}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">{proposal.description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="font-semibold">
                    Price: PKR {proposal.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposals;