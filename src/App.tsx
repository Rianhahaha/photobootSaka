
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function MultipleImagePreview() {
  const [previews, setPreviews] = useState<string[]>([]);


  const [useFrame, setUseFrame] = useState(0);

  const frameList = [
    "/frame1.png",
  ]






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
    <section className="p-4  flex flex-col items-center justify-center relative mx-auto max-w-5xl">
<div className="w-full mb-4">
  <label
    className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 group"
  >
    <div className="flex flex-col items-center justify-center pt-5 pb-6 group-hover:text-indigo-600">
      {/* Ikon Awan Upload */}
      <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
      
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <span className="font-bold">Klik untuk upload</span> (Max 3 foto)
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-400">
        JPG, PNG, atau format lain, (CR2 nggak bisa ya)
      </p>
    </div>
    
    {/* Input aslinya disembunyikan di sini */}
    <input
      type="file"
      accept="image/*,.cr2"
      multiple
      onChange={handleImageChange}
      className="hidden"
    />
  </label>
</div>

      <div
        className="relative w-[200px] bg-center bg-cover h-[600px] overflow-hidden"
        id="canvas"
      >
        <img
          className="w-[200px] h-[600px] object-cover"
          src={frameList[useFrame]}
          alt="frame"
        />

        {previews.map((src, i) => (
          <div
            key={i}
            className={`absolute w-full -z-10 h-[140px] left-1/2 -translate-x-1/2 ${i === 0 ? "top-[80px]" : i === 1 ? "top-[220px]" : "top-[343px]"
              }`}
          >
            <img
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
            >              <img
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