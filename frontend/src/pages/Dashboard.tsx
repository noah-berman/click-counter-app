import React, { useState, useEffect, useRef, useCallback } from 'react';
import { clickService } from '../services/clicks';
import { NavBar } from '../components/NavBar';

export const Dashboard: React.FC = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clicking, setClicking] = useState(false);
  const pendingClicksRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const currentCount = await clickService.getClickCount();
        setCount(currentCount);
      } catch (error) {
        console.error('Failed to load click count:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCount();
  }, []);

  const syncClicksToServer = useCallback(async () => {
    const clicksToSync = pendingClicksRef.current;
    if (isSyncingRef.current || clicksToSync === 0) return;
    
    isSyncingRef.current = true;
    const originalPending = clicksToSync;
    
    try {
      // Record all pending clicks
      for (let i = 0; i < clicksToSync; i++) {
        await clickService.recordClick();
      }
      pendingClicksRef.current = 0;
    } catch (error) {
      console.error('Failed to sync clicks:', error);
      // On error, reload the count from server to stay in sync
      try {
        const serverCount = await clickService.getClickCount();
        setCount(serverCount);
        pendingClicksRef.current = 0;
      } catch (syncError) {
        console.error('Failed to reload count:', syncError);
        // Revert optimistic updates on error
        setCount((prev) => prev - originalPending);
        pendingClicksRef.current = 0;
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const handleClick = useCallback(() => {
    // Optimistic update - increment immediately
    setCount((prev) => prev + 1);
    pendingClicksRef.current += 1;
    setClicking(true);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer - sync after 1 second of no clicks
    debounceTimerRef.current = setTimeout(() => {
      setClicking(false);
      syncClicksToServer();
    }, 1000);
  }, [syncClicksToServer]);

  // Cleanup timer on unmount and sync any pending clicks
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Sync any pending clicks before unmounting
      if (pendingClicksRef.current > 0 && !isSyncingRef.current) {
        syncClicksToServer();
      }
    };
  }, [syncClicksToServer]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800">
          <div className="text-lg text-gray-900 dark:text-white">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Click Counter
            </h1>
            <div className="text-4xl font-semibold text-gray-900 dark:text-white">
              Total Clicks: <span className="text-blue-600 dark:text-blue-400">{count}</span>
            </div>
          </div>
          <button
            onClick={handleClick}
            className={`
              text-6xl font-bold py-8 px-16 rounded-full
              transition-all duration-150 transform
              ${clicking
                ? 'bg-blue-500 dark:bg-blue-600 scale-95'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 hover:scale-105 active:scale-95'
              }
              text-white shadow-2xl
              cursor-pointer
            `}
          >
            CLICK
          </button>
          <p className="mt-8 text-gray-600 dark:text-gray-300 text-lg">
            Click the button above to increment your counter!
          </p>
        </div>
      </div>
    </>
  );
};

