const videoCourseTitles: string[] = [
  "Algebra Tricks: Simplifying Equations Quickly",
  "Plant Cells vs. Animal Cells: Key Differences",
  "Chemical Reactions: Rates and Effects",
  "Understanding Triangles: Properties and Types",
  "AWS Certification: IAM Deep Dive",
  "Major Events of the Middle Ages",
  "Character Development: Analyzing a Short Story",
  "Punctuation Perfection: Mastering Marks",
  "Volcanoes and Earthquakes: A Primer",
  "Storytelling Elements: Crafting Engaging Narratives",
  "Continents Uncovered: A Brief Overview",
  "Impressionism: The Art of Light and Color",
  "Pre-Calculus: Understanding Functions",
  "Conversational Spanish: Practical Phrases and Pronunciation",
  "Introduction to Programming: Python Basics",
  "Decision-Making and Problem-Solving for Teens",
  "Making Sense of Charts and Graphs",
  "The Instruments of an Orchestra: A Beginner's Guide",
  "Climate Change: Causes and Consequences",
  "French Verbs 101: Conjugation and Usage",
];

export const mockVideoNames = (index: number): string => {
  if (index < 0 || index >= videoCourseTitles.length) {
    return "Video not found";
  } else {
    return videoCourseTitles[index];
  }
};

export const statusDisplay = (status: string): string => {
  if (status === "clip_processed") {
    return "READY";
  } else if (status === "clip_readyss") {
    return "PROCESSING...";
  } else {
    return "Unknown";
  }
};
