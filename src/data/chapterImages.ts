// ============================================================
// CHAPTER IMAGES UTILITY
// Extracts real sign images from quiz data per chapter
// ============================================================

export interface SubtopicImage {
  subtopic: string;
  images: string[];
  firstImage: string;
}

/**
 * Extract unique images grouped by subtopic for a given chapter from quiz data.
 * Uses the REAL sign images from the quiz questions.
 */
export function getChapterImages(chapterId: number, allQuestions: any[]): SubtopicImage[] {
  const chQs = allQuestions.filter((q: any) => q.chapter === chapterId);

  const subtopicMap: Record<string, string[]> = {};
  chQs.forEach((q: any) => {
    if (q.image && q.subtopic) {
      if (!subtopicMap[q.subtopic]) {
        subtopicMap[q.subtopic] = [];
      }
      if (!subtopicMap[q.subtopic].includes(q.image)) {
        subtopicMap[q.subtopic].push(q.image);
      }
    }
  });

  return Object.entries(subtopicMap)
    .map(([subtopic, images]) => ({
      subtopic,
      images,
      firstImage: images[0] || '',
    }))
    .filter((s) => s.firstImage);
}

/**
 * Get a limited set of representative images for a chapter (for card previews)
 */
export function getChapterPreviewImages(chapterId: number, allQuestions: any[], maxCount: number = 3): string[] {
  const subtopics = getChapterImages(chapterId, allQuestions);
  return subtopics.slice(0, maxCount).map((s) => s.firstImage);
}

/**
 * Get total unique image count for a chapter
 */
export function getChapterImageCount(chapterId: number, allQuestions: any[]): number {
  const chQs = allQuestions.filter((q: any) => q.chapter === chapterId && q.image);
  return new Set(chQs.map((q: any) => q.image)).size;
}
