import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import '../Styles/SosMap.css';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SosMap = () => {
    const [position, setPosition] = useState(null);
    const [geoError, setGeoError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [sendError, setSendError] = useState('');

    useEffect(() => {
        if (position) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.display_name) {
                        setAddress(data.display_name);
                    } else {
                        setAddress('Address not found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching address:', error);
                    setAddress('Unable to retrieve address');
                    setGeoError('Failed to fetch address.');
                });
        }
    }, [position]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setGeoError('');
                },
                (error) => {
                    alert("Unable to get your location. Please allow location access.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const sendLocation = async () => { // Marked as async to use await
        if (!position) {
            alert("Please get your location first.");
            return;
        }
        if (!phoneNumber.trim()) {
            alert("Please enter a valid phone number.");
            return;
        }

        // Format phone number for WhatsApp (ensure + prefix)
        let formattedNumber = phoneNumber.trim();
        if (!formattedNumber.startsWith('+')) {
            formattedNumber = `+${formattedNumber}`; // Assume international format
        }

        // Validate phone number format (basic check)
        const phoneRegex = /^\+\d{10,12}$/;
        if (!phoneRegex.test(formattedNumber)) {
            alert("Please enter a valid phone number (e.g., +1234567890).");
            return;
        }

        // Send location via WhatsApp
        const message = `My current location: ${address || 'unknown location'}. Coordinates: Latitude ${position.lat}, Longitude ${position.lng}`;
        const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Optionally save location to MongoDB (remove if not needed)
        try {
            const response = await fetch('http://localhost:8080/api/users/location/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: formattedNumber,
                    address,
                    latitude: position.lat,
                    longitude: position.lng,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to save location.");
            }
            console.log("✅ Location saved:", result.message);
        } catch (error) {
            console.error("❌ Error saving location:", error);
            setSendError("Failed to save location, but sent via WhatsApp.");
        }

        setSendError('');
    };

    return (
        <div className="sos_page">
            <header>
                <nav>
                    <ul>
                        <li id="topic">ZenAlert</li>
                        <li><a href="/home">Home</a></li>
                        <li><a href="/sos">SOS Help</a></li>
                        <li><a href="/assessment">Assessment</a></li>
                        <li><a href="/chatbot">Chatbot</a></li>
                        <li><a href="/videos">Videos</a></li>
                        <li><a href="#mood">Mood Track</a></li>
                        <li><a href="/news-api">News API</a></li>
                        <li><a href="/task-management">Task Management</a></li>
                        <li><a href='/'>Logout</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <div className="help_card">
                    <h2 className="title">Send Your Location</h2>
                    <p className="description">Share your current location for immediate assistance.</p>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter Mobile Number (e.g., +1234567890)"
                        className="input_field"
                    />
                    <button onClick={getLocation} className="btn">Get Current Location</button>
                    {geoError && <div className="error">{geoError}</div>}
                    {position && (
                        <>
                            <div className="location_text">📍 Your current location</div>
                            <div className="address_text">{address || "Fetching address..."}</div>
                            <div className="map">
                                <MapContainer center={[position.lat, position.lng]} zoom={13} className="map_full">
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[position.lat, position.lng]}>
                                        <Popup>You are here</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                            <button onClick={sendLocation} className="btn_emergency">SEND MY LIVE LOCATION 📩</button>
                            {sendError && <div className="error">{sendError}</div>}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SosMap;
