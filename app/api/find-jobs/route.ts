import { NextRequest, NextResponse } from "next/server";

// Adzuna gives real job ads with a title, company, salary, and apply link.
// Docs: https://developer.adzuna.com/docs/search

export async function POST(req: NextRequest) {
  const { role, location } = await req.json();

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    return NextResponse.json({ error: "Adzuna keys are missing in .env.local" }, { status: 500 });
  }

  const what = encodeURIComponent(role || "developer");
  const where = encodeURIComponent(location || "India");

  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=12&what=${what}&where=${where}&content-type=application/json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const jobs = (data.results || []).map((job: any) => ({
      title: job.title,
      company: job.company?.display_name || "Not shown",
      location: job.location?.display_name || location || "India",
      salaryMin: job.salary_min ? Math.round(job.salary_min) : null,
      salaryMax: job.salary_max ? Math.round(job.salary_max) : null,
      applyLink: job.redirect_url,
    }));

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not fetch jobs right now" }, { status: 500 });
  }
}