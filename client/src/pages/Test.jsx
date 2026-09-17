import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { motion } from "framer-motion";
import { ArrowRight, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

function Test() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setText("");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text && !imageFile) {
      setError("Masukkan teks atau upload gambar lowongan kerja.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        res = await api.post("/analyze/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/analyze/", { text });
      }
      navigate("/result", { state: { report: res.data.data } });
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Terjadi kesalahan saat analisis."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-24 h-full mx-auto w-full max-w-screen-xl px-4 md:px-20 flex">
      <div className="flex flex-col w-full justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2 } }}
          className="px-2"
        >
          <h2 className="mt-2 tracking-tight text-center text-balance font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white flex flex-col gap-2 mb-4">
            Is it a Trap?
          </h2>
          <h2 className="mt-2 tracking-tight text-center text-balance font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 bg-[#1ecfc1] flex flex-col gap-2 mb-12 sm:mb-20 px-2">
            Let's check yours.
          </h2>
        </motion.div>
        <motion.form
          className="w-full flex flex-col max-w-[600px] justify-center items-center px-4 sm:px-10 border rounded-lg pb-10 sm:pb-14 pt-10 sm:pt-14 gap-10 sm:gap-15"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2 } }}
          onSubmit={handleSubmit}
        >
          <h1 className="tracking-tight text-center text-balance font-bold text-2xl sm:text-3xl md:text-4xl text-white">
            Reality Check
          </h1>

          {error && (
            <div className="w-full rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <FieldGroup className="flex flex-col gap-8 sm:gap-12 w-full">
            <FieldGroup>
              <FieldLabel className="text-md" htmlFor="text">
                Job Description
              </FieldLabel>
              <textarea
                id="text"
                placeholder="Paste the job posting text here..."
                className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y md:text-lg"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!!imageFile}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel className="text-md">Or Upload Image</FieldLabel>
              <div className="flex flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-3 border border-dashed border-input rounded-md cursor-pointer hover:border-[#1ecfc1] transition-colors text-muted-foreground text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4 shrink-0" />
                  {imageFile
                    ? imageFile.name
                    : "Choose image (JPG, PNG, max 5MB)"}
                </label>
                {imagePreview && (
                  <div className="relative w-fit">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="max-h-[200px] rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </FieldGroup>

            <FieldGroup>
              <Button
                type="submit"
                disabled={loading}
                className="mx-auto mt-4 cursor-pointer hover:opacity-90 px-5 py-4 text-md md:text-lg bg-[#1ecfc1] text-gray-900"
              >
                {loading ? (
                  "Analyzing..."
                ) : (
                  <>
                    Scan now <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </FieldGroup>
        </motion.form>
      </div>
    </section>
  );
}

export default Test;
