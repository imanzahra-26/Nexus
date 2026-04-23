import React, { useState, useRef, useEffect } from 'react';

interface VideoCallProps {
  roomId?: string;
  userName?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ roomId = 'room1', userName = 'User' }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Mock WebRTC - Simulated video for demo
  useEffect(() => {
    if (isInCall) {
      // Simulate local video stream
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          // For demo, also show same stream as remote
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log('Camera/microphone access denied:', err);
          // Fallback: show mock video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
          }
        });
    }
  }, [isInCall]);

  const startCall = () => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    
    // Stop all tracks
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      const stream = remoteVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Mock screen share - in real app, you'd use getDisplayMedia
    alert(isScreenSharing ? 'Screen share stopped' : 'Screen share started (demo mode)');
  };

  return (
    <div className="video-call-container" style={{
      backgroundColor: '#1a1a2e',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      minHeight: '500px'
    }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>🎥 Video Call</h2>
      
      {!isInCall ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📹</div>
          <h3>Ready to start a call?</h3>
          <p style={{ color: '#aaa', marginBottom: '30px' }}>Connect with investors or team members face-to-face</p>
          <button
            onClick={startCall}
            style={{
              backgroundColor: '#4F46E5',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Start Call
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {/* Local Video */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ 
                backgroundColor: '#2d2d44', 
                borderRadius: '12px', 
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative'
              }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  You {isMuted ? '🔇' : '🎤'} {isVideoOff ? '📷❌' : '📷'}
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px' }}>You</p>
            </div>

            {/* Remote Video */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ 
                backgroundColor: '#2d2d44', 
                borderRadius: '12px', 
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative'
              }}>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  {userName}
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px' }}>Remote User</p>
            </div>
          </div>

          {/* Call Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={toggleMute}
              style={{
                backgroundColor: isMuted ? '#dc2626' : '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                width: '48px',
                height: '48px',
                fontSize: '20px'
              }}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>

            <button
              onClick={toggleVideo}
              style={{
                backgroundColor: isVideoOff ? '#dc2626' : '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                width: '48px',
                height: '48px',
                fontSize: '20px'
              }}
            >
              {isVideoOff ? '📷❌' : '📷'}
            </button>

            <button
              onClick={toggleScreenShare}
              style={{
                backgroundColor: isScreenSharing ? '#10B981' : '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                width: '48px',
                height: '48px',
                fontSize: '20px'
              }}
            >
              🖥️
            </button>

            <button
              onClick={endCall}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              End Call
            </button>
          </div>
        </>
      )}
    </div>
  );
};