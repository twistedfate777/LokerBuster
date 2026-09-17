import { useState, useEffect } from "react";
import Card from "@/components/Card";
import JobSkeleton from "@/components/skeletons/JobSkeleton";
import api from "@/lib/api";

function Community() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/", { params: { all: "true" } });
        setReports(res.data.results || []);
      } catch {
        setError("Gagal memuat data laporan.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <section className="pb-16 sm:pb-24 pt-10 sm:pt-16 h-full mx-auto w-full max-w-screen-xl px-4 md:px-20">
      <div className="mb-8 sm:mb-12 px-4 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center flex flex-col-reverse gap-5 items-center">
          <h2 className="order-1 mt-2 tracking-tight text-center text-balance font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white flex flex-col gap-2">
            <span className="relative px-1 rounded bg-[#1ecfc1] text-gray-900 py-2">
              Community Ledger
            </span>
            Scan History
          </h2>
          <span className="text-center text-sm sm:text-base">
            Real scan results from the community. See what others have checked
            and help protect each other.
          </span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-8">{error}</p>
      )}

      <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 px-2 sm:px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-8 sm:gap-y-16 gap-4 sm:gap-6 md:gap-10">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border px-4 py-4 rounded-lg">
                  <JobSkeleton />
                </div>
              ))
            : reports.map((report) => (
                <Card report={report} key={report.id} />
              ))}
          {!loading && reports.length === 0 && (
            <p className="text-muted-foreground col-span-2 text-center py-12">
              Belum ada laporan. Jadilah yang pertama melakukan scan!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Community;
