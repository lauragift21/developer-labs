import { defineCollection, z } from 'astro:content';

const workshopSteps = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stepNumber: z.number(),
    duration: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    tags: z.array(z.string()).optional(),
    prerequisites: z.array(z.string()).optional(),
    learningObjectives: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'workers-steps': workshopSteps,
  'mcp-steps': workshopSteps,
};
