import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null); // Data URL for preview
    const [blob, setBlob] = useState(null); // Actual blob to send
    const [error, setError] = useState(null);

    // Initialize Camera
    useEffect(() => {
        startCamera();

        const handleResize = () => {
            // Optional: trigger re-layout logic if needed, 
            // but CSS object-fit usually handles this. 
            // We keep this listener to ensure stream stays active/correct.
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            stopCamera();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    const startCamera = async () => {
        try {
            setError(null);

            // Attempt 1: Try to get the environment (rear) camera
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: "environment" } },
                    audio: false
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.warn("Retrying with default camera due to error:", err);
                // Attempt 2: Fallback to any available video source
                const fallbackStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
                setStream(fallbackStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = fallbackStream;
                }
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Unable to access camera. Please allow permissions or try uploading a file instead.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const handleCapture = () => {
        try {
            if (!videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Defensive Check for dimensions
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.warn("Video stream not ready for capture");
                return;
            }

            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to data URL for preview
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);

            // Convert to Blob for upload
            canvas.toBlob((b) => {
                if (!b) {
                    setError("Failed to process image.");
                    return;
                }
                setBlob(b);
            }, 'image/jpeg', 0.95);

        } catch (e) {
            console.error("Capture failed:", e);
            setError("Could not capture image. Try creating a file instead.");
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setBlob(null);
        setError(null);
    };

    const handleConfirm = () => {
        if (blob) {
            // Create a File object from Blob with unique name
            const timestamp = new Date().getTime();
            const filename = `camera_capture_${timestamp}.jpg`;
            const file = new File([blob], filename, { type: "image/jpeg" });
            onCapture(file);
        }
    };

    return (
        <div className="camera-capture-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>

            {error ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--status-avoid)' }}>
                    <p>{error}</p>
                    <button className="btn-secondary" onClick={onCancel} style={{ marginTop: '12px' }}>
                        Go Back
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', borderRadius: '12px', overflow: 'hidden', background: '#000', aspectRatio: '4/3' }}>
                        {/* Video Feed */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: capturedImage ? 'none' : 'block'
                            }}
                        />

                        {/* Captured Image Preview */}
                        {capturedImage && (
                            <img
                                src={capturedImage}
                                alt="Captured"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        )}

                        {/* Hidden Canvas */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    <div className="camera-controls" style={{ display: 'flex', gap: '16px' }}>
                        {!capturedImage ? (
                            <>
                                <button className="btn-secondary" onClick={onCancel} title="Cancel">
                                    <X size={24} />
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={handleCapture}
                                    style={{
                                        borderRadius: '50%',
                                        width: '64px',
                                        height: '64px',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'white',
                                        border: '4px solid var(--accent-primary)'
                                    }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-secondary" onClick={handleRetake}>
                                    <RefreshCw size={20} style={{ marginRight: '8px' }} />
                                    Retake
                                </button>
                                <button className="btn-primary" onClick={handleConfirm}>
                                    <Check size={20} style={{ marginRight: '8px' }} />
                                    Use Photo
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
