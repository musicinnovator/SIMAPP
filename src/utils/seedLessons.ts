import { supabase } from '../lib/supabase';
import { sampleLessons } from '../data/sampleLessons';

export async function seedLessons() {
  try {
    console.log('Starting lesson seeding...');

    for (const lessonData of sampleLessons) {
      // Check if lesson already exists
      const { data: existing } = await supabase
        .from('lessons')
        .select('id')
        .eq('song_id', lessonData.song_id)
        .single();

      let lessonId: string;

      if (existing) {
        console.log(`Lesson ${lessonData.title} already exists, skipping...`);
        lessonId = existing.id;
      } else {
        // Insert lesson
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            title: lessonData.title,
            description: lessonData.description,
            song_id: lessonData.song_id,
            audio_url: lessonData.audio_url || null,
            lyrics: lessonData.lyrics,
            melody_data: lessonData.melody_data,
            difficulty_level: lessonData.difficulty_level,
            order_index: lessonData.order_index,
            category: lessonData.category,
            is_published: lessonData.is_published
          })
          .select()
          .single();

        if (lessonError) {
          console.error('Error inserting lesson:', lessonError);
          continue;
        }

        lessonId = lesson.id;
        console.log(`Created lesson: ${lessonData.title}`);

        // Insert activities
        for (const activity of lessonData.activities) {
          const { error: activityError } = await supabase
            .from('lesson_activities')
            .insert({
              lesson_id: lessonId,
              activity_type: activity.activity_type,
              activity_order: activity.activity_order,
              title: activity.title,
              instructions: activity.instructions,
              content: activity.content,
              correct_answers: activity.correct_answers,
              hints: activity.hints,
              max_attempts: activity.max_attempts,
              points_possible: activity.points_possible,
              time_limit_seconds: activity.time_limit_seconds
            });

          if (activityError) {
            console.error('Error inserting activity:', activityError);
          } else {
            console.log(`  - Created activity: ${activity.title}`);
          }
        }
      }
    }

    console.log('Lesson seeding completed!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding lessons:', error);
    return { success: false, error };
  }
}

// Function to get all lessons with their activities
export async function getAllLessonsWithActivities() {
  try {
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select(`
        *,
        activities:lesson_activities(*)
      `)
      .eq('is_published', true)
      .order('order_index');

    if (lessonsError) throw lessonsError;

    return lessons || [];
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
}

// Function to initialize sample data on first run
export async function initializeLessons() {
  const { data: existing } = await supabase
    .from('lessons')
    .select('id')
    .limit(1);

  if (!existing || existing.length === 0) {
    console.log('No lessons found, seeding database...');
    await seedLessons();
  } else {
    console.log('Lessons already exist in database');
  }
}
