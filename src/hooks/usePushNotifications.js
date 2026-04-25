import { useState, useEffect } from 'react';

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY || '';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if push notifications are supported
    const supported =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setIsSupported(supported);

    if (supported) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.warn('Failed to check push subscription:', err);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      setError('Push notifications não são suportadas neste dispositivo');
      return false;
    }

    try {
      // Request Notification permission
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        setError('Permissão negada para notificações');
        return false;
      }

      // Subscribe to push
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

      setIsSubscribed(true);
      setError(null);

      // TODO: Send subscription to backend
      console.log('Push subscription:', subscription);

      return true;
    } catch (err) {
      const message = err.name === 'NotAllowedError'
        ? 'Permissão negada para notificações'
        : `Erro ao ativar notificações: ${err.message}`;
      setError(message);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        // TODO: Notify backend
      }

      return true;
    } catch (err) {
      setError(`Erro ao desativar notificações: ${err.message}`);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    error,
    requestPermission,
    unsubscribe,
  };
}
