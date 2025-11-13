'use client'
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";

export default function MultipleImagePreview() {
  const [previews, setPreviews] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [useFrame, setUseFrame] = useState(0);

  const frameList = [
    "/frame1.png",
    "/frame2.png",
    "/frame3.png",
    "/frame4.png",
  ]

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal mengakses kamera. Pastikan izin diberikan.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStreaming(false);
    }
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);

    if (selectedFiles.length + previews.length > 3) {
      alert("Maksimal 3 gambar saja, bro.");
      return;
    }

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleCapture = async () => {
    const canvasElement = document.getElementById("canvas");
    if (!canvasElement) return;

    const canvas = await html2canvas(canvasElement, {
  scale: 5,
  useCORS: true,
  // windowWidth: canvasElement.scrollWidth,
  // windowHeight: canvasElement.scrollHeight,
    });

    const dataUrl = canvas.toDataURL("image/png");

    // bikin link download manual
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "frame-result.png";
    link.click();
  };

  return (
    <section className="p-4  flex flex-col items-center justify-center relative">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="border w-full mb-4"
      />

      <div
        className="relative w-[200px] bg-center bg-cover h-[600px] overflow-hidden"
        id="canvas"
      >
        <Image
          className="size-full object-cover"
          src={frameList[useFrame]}
          alt="frame"
          width={1000}
          height={1000}
        />

        {previews.map((src, i) => (
          <div
            key={i}
            className={`absolute w-full -z-10 h-[141px] left-1/2 -translate-x-1/2 ${i === 0 ? "top-[70px]" : i === 1 ? "top-[211px]" : "top-[343px]"
              }`}
          >
            <Image
              width={1000}
              height={1000}
              src={src}
              alt={`preview-${i}`}
              className="size-full object-cover rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleCapture}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
      >
        Capture & Download
      </button>

      <div>

      </div>

      <div>
        <div className="text-center mt-7">
          select frame
        </div>
        <div className="grid grid-cols-3 gap-5">
          {frameList.map((frame, i) => (
            <div
              key={i}
              onClick={() => setUseFrame(i)}
              className={`max-w-40 border-4 rounded-lg overflow-hidden cursor-pointer transition-all ${useFrame === i ? "border-white" : "border-transparent"
                }`}
            >              <Image
                className="size-full object-cover hover:brightness-125 cursor-pointer"
                src={frame}
                alt="frame"
                width={200}
                height={200}
              />
            </div>
          ))}
        </div>
      </div>

      {/* <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold">Trial Akses Kamera</h2>
      {!streaming ? (
        <button
          onClick={startCamera}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Mulai Kamera
        </button>
      ) : (
        <button
          onClick={stopCamera}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Kamera
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <video
        ref={videoRef}
        className="border w-[300px] h-[200px] object-cover mt-2"
        autoPlay
        muted
      />
    </div> */}
    </section>
  );
}
