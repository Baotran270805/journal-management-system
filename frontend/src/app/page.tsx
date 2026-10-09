'use client';

import { useEffect, useState } from 'react';

type DbCheckResponse = {
  message: string;
  userCount: number;
};

export default function Home() {
  const [data, setData] = useState<DbCheckResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/db-check`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không gọi được backend');
        }

        return response.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Journal Management System
      </h1>

      <p className="mt-4">
        Frontend Next.js đang hoạt động.
      </p>

      {data && (
        <div className="mt-6">
          <p>{data.message}</p>
          <p>User count: {data.userCount}</p>
        </div>
      )}

      {error && (
        <p className="mt-6 text-red-500">
          {error}
        </p>
      )}
    </main>
  );
}