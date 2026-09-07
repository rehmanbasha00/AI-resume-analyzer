"use client";

import { useEffect, useState } from "react";

interface Job {
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  applyLink: string;
}

interface Props {
  defaultRole?: string;
  defaultLocation?: string;
}

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "Not shown";
  const toLPA = (n: number) => (n / 100000).toFixed(1);
  if (min && max) return `${toLPA(min)} - ${toLPA(max)} LPA`;
  return `${toLPA((min || max) as number)} LPA`;
}

export default function FindJobs({ defaultRole = "", defaultLocation = "" }: Props) {
  const [role, setRole] = useState(defaultRole);
  const [location, setLocation] = useState(defaultLocation);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (defaultRole && !role) setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    if (defaultLocation && !location) setLocation(defaultLocation);
  }, [defaultLocation]);

  useEffect(() => {
    if (defaultRole && defaultLocation && !searched) {
      searchJobs(defaultRole, defaultLocation);
    }
  }, [defaultRole, defaultLocation]);

  async function searchJobs(searchRole?: string, searchLocation?: string) {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch("/api/find-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: searchRole ?? role,
          location: searchLocation ?? location,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError("Jobs load nahi hue, dobara try karo.");
        setJobs([]);
        return;
      }

      setJobs(data.jobs || []);
    } catch (err) {
      setError("Kuch gadbad hui, dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role, e.g. Frontend Developer"
          className="rounded border border-border bg-surface p-2.5 text-sm outline-none focus:border-accent"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location, e.g. Bangalore"
          className="rounded border border-border bg-surface p-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <button
        onClick={() => searchJobs()}
        disabled={loading}
        className="self-start rounded bg-accent text-bg font-heading text-sm px-4 py-2 disabled:opacity-40"
      >
        {loading ? "Finding jobs..." : "Find Jobs"}
      </button>

      {error && <p className="text-danger text-sm">{error}</p>}

      {searched && !loading && !error && jobs.length === 0 && (
        <p className="text-muted text-sm">No jobs found, try a different role or location.</p>
      )}

      <div className="flex flex-col gap-3">
        {jobs.map((job, i) => (
          <div key={i} className="rounded border border-border bg-surface p-4 flex flex-col gap-1">
            <p className="font-heading text-sm">{job.title}</p>
            <p className="text-muted text-sm">{job.company} · {job.location}</p>
            <p className="text-accent text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</p>
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 self-start text-sm rounded border border-accent text-accent px-3 py-1.5 hover:bg-accentSoft"
            >
              Apply Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}