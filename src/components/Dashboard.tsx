import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Music, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Match {
  id: string;
  name: string;
  profilePicture: string;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (currentUser) {
        const matchesRef = collection(firestore, 'matches');
        const q = query(matchesRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const matchesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
        setMatches(matchesData);
      }
    };

    fetchMatches();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Music className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">Music Match</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/discover" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Discover
              </Link>
              <Link to="/messages" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Messages
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {currentUser?.displayName}!</h1>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Your Matches</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">People who share your music taste</p>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {matches.map((match) => (
                  <li key={match.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="h-12 w-12 rounded-full" src={match.profilePicture} alt={match.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{match.name}</p>
                      </div>
                      <div>
                        <Link
                          to={`/messages/${match.id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;