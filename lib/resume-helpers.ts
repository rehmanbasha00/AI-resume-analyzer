// Simple guess of years of experience from the resume text.
// Looks for patterns like "2 years" or "3+ years" anywhere in the text.
// If nothing found, returns empty string, user can type it manually.

export function guessExperienceFromResume(text: string): string {
  const match = text.match(/(\d+(\.\d+)?\+?)\s*(years?|yrs?)/i);
  return match ? `${match[1]} years` : "";
}

// Simple guess of the user's city from the resume text.
// Looks for common Indian city names anywhere in the text.
// If nothing found, returns "India", user can type their own city.

const KNOWN_CITIES = [
  "Bangalore", "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Noida", "Gurgaon", "Gurugram",
  "Jaipur", "Kochi", "Chandigarh", "Indore", "Nagpur", "Bhopal",
  "Coimbatore", "Vadodara", "Surat", "Lucknow", "Patna", "Hubli", "Hubballi",
];

export function guessLocationFromResume(text: string): string {
  const found = KNOWN_CITIES.find((city) =>
    new RegExp(`\\b${city}\\b`, "i").test(text)
  );
  return found || "India";
}