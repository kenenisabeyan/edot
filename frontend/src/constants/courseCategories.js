export const COURSE_CATEGORIES = {
  "Social Science": [
    "History",
    "Geography",
    "Sociology",
    "Psychology",
    "Political Science",
    "Economics",
    "Anthropology"
  ],
  "Mathematics & Natural Science": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Statistics",
    "Earth Science"
  ],
  "Natural Language": [
    "English",
    "Literature",
    "Linguistics",
    "Creative Writing",
    "Foreign Languages",
    "Communication Studies"
  ],
  "Programming & Technology": [
    "Programming",
    "Web Development",
    "Data Science",
    "Cybersecurity",
    "AI & Machine Learning",
    "Cloud Computing",
    "Mobile Development"
  ],
  "Business & Entrepreneurship": [
    "Entrepreneurship",
    "Finance",
    "Marketing",
    "Management",
    "Accounting",
    "Business Analytics",
    "Sales"
  ],
  "Personal Development": [
    "Leadership",
    "Time Management",
    "Public Speaking",
    "Career Development",
    "Personal Finance",
    "Stress Management"
  ]
};

export const MAIN_CATEGORIES = Object.keys(COURSE_CATEGORIES);

export const ALL_SUBCATEGORIES = Object.values(COURSE_CATEGORIES).flat();

export default COURSE_CATEGORIES;
