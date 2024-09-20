// src/app/test/page.tsx
'use client'
import React, { useState } from 'react';

const TestPage = () => {
    const [userAId, setUserAId] = useState('');
    const [userBId, setUserBId] = useState('');
    const [response, setResponse] = useState(null);

    const handleLike = async () => {
        const res = await fetch(`/api/pet/${userAId}/like/${userBId}`, {
            method: 'POST',
        });

        const data = await res.json();
        setResponse(data);
    };

    return (
        <div>
            <h1>Test Like API</h1>
            <div>
                <input
                    type="text"
                    placeholder="User A ID"
                    value={userAId}
                    onChange={(e) => setUserAId(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="User B ID"
                    value={userBId}
                    onChange={(e) => setUserBId(e.target.value)}
                />
            </div>
            <button onClick={handleLike}>Like</button>
            {response && <div>Response: {JSON.stringify(response)}</div>}
        </div>
    );
};

export default TestPage;
