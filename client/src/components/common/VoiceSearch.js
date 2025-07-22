import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const VoiceSearch = ({ onSearch, placeholder = "Search products..." }) => {
    const [isListening, setIsListening] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onstart = () => {
                setIsListening(true);
            };

            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                onSearch(transcript);
                setIsListening(false);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
            setIsSupported(true);
        } else {
            setIsSupported(false);
            console.warn('Speech recognition not supported in this browser');
        }
    }, [onSearch]);

    const startListening = () => {
        if (recognition && !isListening) {
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && isListening) {
            recognition.stop();
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
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
                        className={`voice-btn ${isListening ? 'listening' : ''}`}
                        title={isListening ? 'Stop voice search' : 'Start voice search'}
                    >
                        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                )}
            </div>
            {isListening && (
                <div className="listening-indicator">
                    <div className="wave"></div>
                    <span>Listening...</span>
                </div>
            )}
            {!isSupported && (
                <div className="voice-not-supported">
                    Voice search not supported in this browser
                </div>
            )}
        </div>
    );
};

export default VoiceSearch;
