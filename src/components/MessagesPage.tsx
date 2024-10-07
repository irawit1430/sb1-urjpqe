import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore, database } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, push, onValue, off } from 'firebase/database';
import { Send } from 'lucide-react';

interface Match {
  id: string;
  name: string;
  profilePicture: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

const MessagesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

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

  useEffect(() => {
    if (currentUser && selectedMatch) {
      const chatId = [currentUser.uid, selectedMatch.id].sort().join('_');
      const messagesRef = ref(database, `messages/${chatId}`);

      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          }));
          setMessages(messageList);
        }
      });

      return () => off(messagesRef);
    }
  }, [currentUser, selectedMatch]);

  const sendMessage = () => {
    if (currentUser && selectedMatch && newMessage.trim()) {
      const chatId = [currentUser.uid, selectedMatch.id].sort().join('_');
      const messagesRef = ref(database, `messages/${chatId}`);
      push(messagesRef, {
        senderId: currentUser.uid,
        text: newMessage.trim(),
        timestamp: Date.now(),
      });
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/3 bg-white border-r border-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Matches</h2>
        <ul>
          {matches.map((match) => (
            <li
              key={match.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
                selectedMatch?.id === match.id ? 'bg-purple-100' : ''
              }`}
              onClick={() => setSelectedMatch(match)}
            >
              <img src={match.profilePicture} alt={match.name} className="w-12 h-12 rounded-full mr-4" />
              <span className="font-medium">{match.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedMatch ? (
          <>
            <div className="bg-white p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold">{selectedMatch.name}</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.senderId === currentUser?.uid ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.senderId === currentUser?.uid
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow mr-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition duration-300"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a match to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;