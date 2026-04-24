import React, { useState } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

export const GuidedTour: React.FC = () => {
  const [runTour, setRunTour] = useState(false);

  const steps: Step[] = [
    {
      target: '.calendar-section',
      title: '📅 Schedule Meetings',
      content: 'Select a date on the calendar to schedule meetings with entrepreneurs.',
      placement: 'bottom',
    },
    {
      target: '.video-call-container',
      title: '🎥 Video Calling',
      content: 'Start video calls with investors or team members. Mute audio or turn off video as needed.',
      placement: 'top',
    },
    {
      target: '.payment-section',
      title: '💰 Wallet & Payments',
      content: 'Deposit funds, withdraw money, or transfer to other users. Track all transactions.',
      placement: 'top',
    },
    {
      target: '.availability-slots',
      title: '🕐 Availability',
      content: 'Add time slots when you are available for meetings.',
      placement: 'bottom',
    },
    {
      target: '.featured-startups',
      title: '🤝 Connect',
      content: 'Browse startups and send meeting requests to founders.',
      placement: 'top',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setRunTour(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#4F46E5',
          color: 'white',
          padding: '12px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          width: '50px',
          height: '50px',
          fontSize: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        🎓
      </button>
      
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#4F46E5',
            zIndex: 10000,
          },
        }}
      />
    </>
  );
};