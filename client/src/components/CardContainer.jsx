import Card from "./Card";
import JobSkeleton from "./skeletons/JobSkeleton";

function CardContainer({ reports = [], loading = false }) {
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16 gap-6 md:gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border px-4 py-4">
              <JobSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16 gap-6 md:gap-10">
        {reports.map((report) => (
          <Card report={report} key={report.id} />
        ))}
      </div>
    </div>
  );
}

export default CardContainer;
