import React, { useState, useEffect, useCallback } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const VoiceSearch = ({ onSearch, placeholder = "Search products..." }) => {
    const [isListening, setIsListening] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [usingLocalMode, setUsingLocalMode] = useState(false);

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setError(''); // Clear error when back online
        };
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Memoize the search callback to prevent unnecessary re-renders
    const handleSearchCallback = useCallback((transcript) => {
        console.log('Voice search transcript:', transcript);
        // Update the input field with the transcript
        setSearchTerm(transcript);
        
        // Call the search function
        if (onSearch && typeof onSearch === 'function') {
            console.log('Calling onSearch with transcript:', transcript);
            onSearch(transcript);
        } else {
            console.error('onSearch is not available or not a function', onSearch);
        }
    }, [onSearch]);

    // Function to retry voice recognition
    const retryRecognition = useCallback(() => {
        if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            setError('');
            
            // On second retry, try with different settings
            if (retryCount === 1) {
                // Create a different configuration that might work better with network restrictions
                try {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                        const fallbackRecognition = new SpeechRecognition();
                        fallbackRecognition.continuous = true; // Try continuous mode
                        fallbackRecognition.interimResults = true;
                        fallbackRecognition.lang = 'en-US';
                        fallbackRecognition.maxAlternatives = 1;
                        
                        // Copy over the same event handlers
                        fallbackRecognition.onstart = recognition.onstart;
                        fallbackRecognition.onresult = recognition.onresult;
                        fallbackRecognition.onerror = recognition.onerror;
                        fallbackRecognition.onend = recognition.onend;
                        
                        // Replace the current recognition instance
                        setRecognition(fallbackRecognition);
                        console.log("Switched to fallback recognition mode");
                    }
                } catch (e) {
                    console.error("Error creating fallback recognition:", e);
                }
            }
            
            setTimeout(() => {
                startListening();
            }, 1000);
        } else {
            setError('Voice recognition failed after multiple attempts. Please type your search instead.');
        }
    }, [retryCount, recognition]);

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = true; // Enable interim results for better responsiveness
            recognitionInstance.lang = 'en-US';
            recognitionInstance.maxAlternatives = 3; // Get more alternatives to improve accuracy
            
            // Add timeout handling
            let recognitionTimeout;

            recognitionInstance.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
                setError('');
                setRetryCount(0); // Reset retry count on successful start
                
                // Set a timeout to handle cases where recognition hangs
                recognitionTimeout = setTimeout(() => {
                    if (recognitionInstance) {
                        recognitionInstance.stop();
                        setError('Voice recognition timed out. Please try again.');
                        setIsListening(false);
                    }
                }, 10000); // 10 second timeout
                
                // Shorter timeout for checking network connectivity
                setTimeout(() => {
                    // If we're still listening after 3 seconds, assume network is okay
                    if (isListening) {
                        setUsingLocalMode(false);
                    }
                }, 3000);
            };

            recognitionInstance.onresult = (event) => {
                // Clear the timeout since we got a result
                if (recognitionTimeout) {
                    clearTimeout(recognitionTimeout);
                }
                
                const lastResult = event.results[event.results.length - 1];
                const transcript = lastResult[0].transcript;
                console.log('Speech recognition result:', transcript, 'Final:', lastResult.isFinal);
                
                // Handle both interim and final results
                if (lastResult.isFinal) {
                    handleSearchCallback(transcript);
                    setIsListening(false);
                } else {
                    // Show interim results in the input field
                    setSearchTerm(transcript);
                }
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                
                // Clear the timeout
                if (recognitionTimeout) {
                    clearTimeout(recognitionTimeout);
                }
                
                let errorMessage = 'Voice recognition error';
                let shouldRetry = false;
                
                switch (event.error) {
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
                        break;
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please speak clearly into your microphone.';
                        shouldRetry = true;
                        break;
                    case 'audio-capture':
                        errorMessage = 'No microphone found. Please check your microphone connection.';
                        break;
                    case 'network':
                        errorMessage = 'Voice search not working due to network restrictions. For best results: 1) Use Chrome, 2) Check internet connection, 3) Check firewall settings.';
                        switchToManualInput('network');
                        return; // Skip the rest to avoid multiple messages
                    case 'aborted':
                        // Don't show error for user-initiated aborts
                        console.log('Voice recognition was aborted');
                        setIsListening(false);
                        return;
                    case 'service-not-allowed':
                        errorMessage = 'Speech recognition service is not available in this browser. Try using Chrome instead.';
                        break;
                    default:
                        errorMessage = `Voice recognition error: ${event.error}. Please try speaking clearly.`;
                        shouldRetry = true;
                }
                
                setError(errorMessage);
                setIsListening(false);
                
                // Auto-retry for certain errors if retry count is low
                if (shouldRetry && retryCount < 1) {
                    setTimeout(() => {
                        retryRecognition();
                    }, 2000);
                }
            };

            recognitionInstance.onend = () => {
                console.log('Speech recognition ended');
                
                // Clear the timeout
                if (recognitionTimeout) {
                    clearTimeout(recognitionTimeout);
                }
                
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
            setIsSupported(true);
        } else {
            setIsSupported(false);
            setError('Speech recognition not supported in this browser');
            console.warn('Speech recognition not supported in this browser');
        }
    }, [handleSearchCallback, retryCount, retryRecognition]);

    // Function to switch to direct keyboard input when voice recognition fails
    const switchToManualInput = (errorType) => {
        setIsListening(false);
        if (errorType === 'network') {
            setError('Network error detected. Please try these solutions: 1) Use Chrome browser, 2) Check your internet connection, 3) Disable VPN/proxy, 4) Allow microphone in browser settings');
        }
        // Focus the input field so user can type
        const inputField = document.querySelector('.voice-search-input');
        if (inputField) {
            inputField.focus();
        }
    };

    const startListening = () => {
        if (recognition && !isListening) {
            // Check if browser is online
            if (!isOnline) {
                setError('You appear to be offline. Voice search requires an internet connection.');
                return;
            }
            
            try {
                console.log('Starting voice recognition...');
                setError('');
                
                // Check if recognition is already running and stop it
                try {
                    recognition.abort();
                } catch (e) {
                    // Ignore error if recognition wasn't running
                }
                
                // Small delay before starting to ensure previous session is closed
                setTimeout(() => {
                    try {
                        recognition.start();
                        
                        // If we've had network errors before, show helpful message
                        if (retryCount > 0) {
                            setError('Speak clearly and wait a moment... Voice search works best in Chrome.');
                            // Auto-dismiss the message after 3 seconds
                            setTimeout(() => setError(''), 3000);
                        }
                    } catch (err) {
                        console.error('Error starting recognition after delay:', err);
                        setError('Failed to start voice recognition. Please try again.');
                        setIsListening(false);
                    }
                }, 100);
                
            } catch (err) {
                console.error('Error starting recognition:', err);
                setError('Failed to start voice recognition. Please try again.');
            }
        }
    };

    const stopListening = () => {
        if (recognition && isListening) {
            try {
                console.log('Stopping voice recognition...');
                recognition.stop();
            } catch (err) {
                console.error('Error stopping recognition:', err);
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch && typeof onSearch === 'function') {
            onSearch(value);
        }
    };

    return (
        <div className="voice-search-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="voice-search-input"
                />
                {isSupported && (
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`voice-btn ${isListening ? 'listening' : ''} ${!isOnline ? 'offline' : ''}`}
                        title={
                            !isOnline 
                                ? 'Voice search requires internet connection' 
                                : isListening 
                                    ? 'Stop voice search' 
                                    : 'Start voice search'
                        }
                        disabled={!isOnline}
                    >
                        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                )}
            </div>
            {isListening && (
                <div className="listening-indicator">
                    <div className="wave"></div>
                    <span>Listening... (speak clearly now)</span>
                </div>
            )}
            {!isSupported && (
                <div className="voice-not-supported">
                    Voice search not supported in this browser. Try Chrome or Edge.
                </div>
            )}
            {error && (
                <div className={`voice-error ${error.includes('network') || error.includes('restrictions') ? 'network-error' : ''}`}>
                    <span>{error}</span>
                    <div>
                        <button 
                            onClick={() => setError('')}
                            className="error-dismiss-btn"
                            title="Dismiss error"
                        >
                            ✕
                        </button>
                        {retryCount < 2 && !error.includes('network') && !error.includes('restrictions') && (
                            <button 
                                onClick={retryRecognition}
                                className="error-retry-btn"
                                title="Try again"
                                style={{ marginLeft: '5px', padding: '2px 6px', fontSize: '12px' }}
                            >
                                🔄
                            </button>
                        )}
                    </div>
                </div>
            )}
            {!isOnline && (
                <div className="voice-offline">
                    Offline - Voice search unavailable
                </div>
            )}
        </div>
    );
};

export default VoiceSearch;
