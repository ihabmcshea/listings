// components/DraftListingsButton.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const DraftListingsButton: React.FC = () => {
  const [draftCount, setDraftCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDraftCount = async () => {
      try {
        const response = await fetch('/api/draft-count');
        const data = await response.json();
        setDraftCount(data.count);
      } catch (error) {
        console.error('Error fetching draft count:', error);
        setDraftCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDraftCount();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Button
          mr={4}
          colorScheme="teal"
          onClick={() => router.push('/drafts')} // Adjust route as necessary
        >
          Draft Listings ({draftCount})
        </Button>
      )}
    </>
  );
};

export default DraftListingsButton;
