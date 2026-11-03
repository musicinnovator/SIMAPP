import React from 'react';
import { BookOpen, Play, Music, Target, Clock, Star, Volume2, Award, TrendingUp } from 'lucide-react';

interface Lesson {
  title: string;
  subtitle: string;
  music: string;
  time: string;
  level: string;
}

interface LessonCardProps {
  title: string;
  subtitle: string;
  gradient: string;
  iconGradient: string;
  icon: any;
  concept: string;
  lessons: Lesson[];
}

function LessonCard({ title, subtitle, gradient, iconGradient, icon: Icon, concept, lessons }: LessonCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300`}>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className={`bg-gradient-to-r ${iconGradient} p-3 rounded-xl shadow-lg flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-blue-100 text-sm">{subtitle}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 border border-white/10">
          <p className="text-blue-100 text-sm leading-relaxed">{concept}</p>
        </div>

        <div className="space-y-2">
          {lessons.map((lesson, idx) => (
            <div key={idx} className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm group-hover:text-yellow-300 transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-blue-200 text-xs mt-0.5">{lesson.subtitle}</p>
                  <p className="text-blue-300 text-xs mt-1 font-mono">{lesson.music}</p>
                </div>
                <Play className="w-4 h-4 text-yellow-400 flex-shrink-0 ml-2" />
              </div>
              <div className="flex items-center space-x-3 text-xs text-blue-200">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{lesson.time}</span>
                </span>
                <span className={`px-2 py-0.5 rounded ${
                  lesson.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                  lesson.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {lesson.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className={`w-full bg-gradient-to-r ${iconGradient} text-white font-bold py-2 rounded-xl hover:opacity-90 transition-all shadow-lg text-sm`}>
          Start Learning
        </button>
      </div>
    </div>
  );
}

export function LessonsPageNew() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Lessons</h1>
        <p className="text-xl text-blue-100">Learn scripture through different types of music</p>
        <p className="text-blue-200 text-lg max-w-4xl mx-auto">
          Explore 15 unique musical styles, each designed to teach Scripture through distinct melodic and harmonic patterns
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. Melodies of Praise */}
        <LessonCard
          title="Melodies of Praise"
          subtitle="Ascending scales expressing upward joy"
          gradient="from-yellow-500/20 to-orange-500/20"
          iconGradient="from-yellow-400 to-orange-500"
          icon={Music}
          concept="Experience praise through ascending melodies that lift your spirit upward toward heaven."
          lessons={[
            { title: "Psalm 100", subtitle: "Make a Joyful Noise", music: "C Major ascending (C-D-E-F-G-A-B-C)", time: "8 min", level: "Beginner" },
            { title: "Psalm 150", subtitle: "Praise with Instruments", music: "G Major ascending (G-A-B-C-D-E-F#-G)", time: "10 min", level: "Intermediate" },
            { title: "Luke 2:14", subtitle: "Glory to God", music: "D Major ascending (D-E-F#-G-A-B-C#-D)", time: "12 min", level: "Intermediate" },
            { title: "Psalm 147", subtitle: "Sing to the Lord", music: "F Major ascending (F-G-A-Bb-C-D-E-F)", time: "9 min", level: "Beginner" }
          ]}
        />

        {/* 2. Harmonies of Trust */}
        <LessonCard
          title="Harmonies of Trust"
          subtitle="Stable chords representing security"
          gradient="from-blue-500/20 to-cyan-500/20"
          iconGradient="from-blue-400 to-cyan-500"
          icon={Volume2}
          concept="Discover peace through consonant harmonies. Stable progressions represent God's unchanging nature."
          lessons={[
            { title: "Psalm 23", subtitle: "The Lord is My Shepherd", music: "C-F-C progression (I-IV-I)", time: "10 min", level: "Beginner" },
            { title: "Proverbs 3:5-6", subtitle: "Trust in the Lord", music: "G-C-G (I-IV-I perfect cadence)", time: "8 min", level: "Beginner" },
            { title: "John 14:27", subtitle: "Peace I Leave", music: "F-C-G (I-V-I)", time: "12 min", level: "Intermediate" },
            { title: "Nahum 1:7", subtitle: "The Lord is Good", music: "D-G-A-D (I-IV-V-I)", time: "11 min", level: "Intermediate" }
          ]}
        />

        {/* 3. Minor Keys of Repentance */}
        <LessonCard
          title="Minor Keys of Repentance"
          subtitle="Sorrow leading to major resolutions"
          gradient="from-gray-600/20 to-slate-500/20"
          iconGradient="from-gray-500 to-slate-600"
          icon={Music}
          concept="Journey from minor key sorrow to major key redemption, representing repentance and restoration."
          lessons={[
            { title: "Psalm 51", subtitle: "Create in Me a Clean Heart", music: "A minor → A Major resolution (Am-Dm-E-A)", time: "14 min", level: "Advanced" },
            { title: "Joel 2:12-13", subtitle: "Return to the Lord", music: "D minor → D Major (Dm-Gm-A-D)", time: "12 min", level: "Intermediate" },
            { title: "Luke 15:18", subtitle: "The Prodigal Returns", music: "E minor → E Major (Em-Am-B-E)", time: "13 min", level: "Advanced" },
            { title: "2 Chronicles 7:14", subtitle: "If My People Pray", music: "B minor → B Major (Bm-Em-F#-B)", time: "11 min", level: "Intermediate" }
          ]}
        />

        {/* 4. Gentle Rhythms of Comfort */}
        <LessonCard
          title="Gentle Rhythms of Comfort"
          subtitle="Slow, tender patterns bringing solace"
          gradient="from-green-500/20 to-emerald-500/20"
          iconGradient="from-green-400 to-emerald-500"
          icon={Volume2}
          concept="Experience God's comfort through slow, gentle rhythms that calm the soul and ease burdens."
          lessons={[
            { title: "Psalm 46:10", subtitle: "Be Still and Know", music: "Slow 3/4 waltz in C Major (60 BPM)", time: "15 min", level: "Beginner" },
            { title: "Matthew 11:28", subtitle: "Come to Me", music: "Gentle 4/4 in F Major (55 BPM)", time: "12 min", level: "Beginner" },
            { title: "Isaiah 40:1", subtitle: "Comfort My People", music: "Lullaby rhythm in Eb Major (50 BPM)", time: "14 min", level: "Intermediate" },
            { title: "2 Corinthians 1:3-4", subtitle: "God of All Comfort", music: "Slow ballad in G Major (58 BPM)", time: "13 min", level: "Beginner" }
          ]}
        />

        {/* 5. Complex Harmonies of Wisdom */}
        <LessonCard
          title="Complex Harmonies of Wisdom"
          subtitle="Sophisticated progressions revealing depth"
          gradient="from-purple-500/20 to-violet-500/20"
          iconGradient="from-purple-400 to-violet-500"
          icon={Award}
          concept="Explore rich, complex chord progressions that mirror the depth and mystery of divine wisdom."
          lessons={[
            { title: "Proverbs 9:10", subtitle: "Fear of the Lord", music: "Cmaj7-Fmaj9-Dm7-G13 (jazz voicings)", time: "16 min", level: "Advanced" },
            { title: "Job 28:28", subtitle: "Where is Wisdom", music: "Em9-Am11-D7#9-Gmaj7 progression", time: "18 min", level: "Advanced" },
            { title: "1 Corinthians 1:25", subtitle: "Wisdom of God", music: "Bb-Ebmaj7-Cm7-F7sus4 (modal)", time: "17 min", level: "Advanced" },
            { title: "James 1:5", subtitle: "Ask for Wisdom", music: "A-D/F#-E/G#-Amaj9 (inversions)", time: "15 min", level: "Advanced" }
          ]}
        />

        {/* 6. Major Scales of Joy */}
        <LessonCard
          title="Major Scales of Joy"
          subtitle="Bright major keys celebrating gladness"
          gradient="from-rose-500/20 to-pink-500/20"
          iconGradient="from-rose-400 to-pink-500"
          icon={Star}
          concept="Celebrate joy through bright major keys and ascending patterns that express pure happiness."
          lessons={[
            { title: "Psalm 16:11", subtitle: "Fullness of Joy", music: "E Major scale ascending (E-F#-G#-A-B-C#-D#-E)", time: "9 min", level: "Beginner" },
            { title: "Nehemiah 8:10", subtitle: "Joy of the Lord", music: "A Major scale (A-B-C#-D-E-F#-G#-A)", time: "10 min", level: "Beginner" },
            { title: "John 15:11", subtitle: "My Joy in You", music: "Bb Major scale (Bb-C-D-Eb-F-G-A-Bb)", time: "11 min", level: "Intermediate" },
            { title: "Philippians 4:4", subtitle: "Rejoice Always", music: "D Major scale (D-E-F#-G-A-B-C#-D)", time: "8 min", level: "Beginner" }
          ]}
        />

        {/* 7. Rising Melodies of Hope */}
        <LessonCard
          title="Rising Melodies of Hope"
          subtitle="Uplifting lines expressing expectation"
          gradient="from-amber-500/20 to-yellow-500/20"
          iconGradient="from-amber-400 to-yellow-500"
          icon={TrendingUp}
          concept="Discover hope through rising melodic lines that reach upward, expressing faith and expectation."
          lessons={[
            { title: "Romans 15:13", subtitle: "God of Hope", music: "Rising sequence: C-E-G-C-E (octave leap)", time: "12 min", level: "Intermediate" },
            { title: "Jeremiah 29:11", subtitle: "Plans for Hope", music: "Ascending motif: F-A-C-F-A-C", time: "11 min", level: "Intermediate" },
            { title: "Hebrews 11:1", subtitle: "Substance of Hope", music: "G-B-D-G (rising triads)", time: "10 min", level: "Beginner" },
            { title: "Lamentations 3:21-22", subtitle: "Great Faithfulness", music: "Eb-G-Bb-Eb (upward progression)", time: "13 min", level: "Intermediate" }
          ]}
        />

        {/* 8. Sustained Notes of Peace */}
        <LessonCard
          title="Sustained Notes of Peace"
          subtitle="Long tones with slow harmonic rhythm"
          gradient="from-teal-500/20 to-cyan-500/20"
          iconGradient="from-teal-400 to-cyan-500"
          icon={Volume2}
          concept="Experience profound peace through sustained notes and slow harmonic changes that create tranquility."
          lessons={[
            { title: "Philippians 4:7", subtitle: "Peace That Passes Understanding", music: "Whole notes in F Major (4 beats each)", time: "16 min", level: "Beginner" },
            { title: "Numbers 6:24-26", subtitle: "The Lord Bless You", music: "Sustained Bb Major chord (8 beats)", time: "14 min", level: "Beginner" },
            { title: "Isaiah 26:3", subtitle: "Perfect Peace", music: "Long C Major pedal tone", time: "15 min", level: "Intermediate" },
            { title: "Colossians 3:15", subtitle: "Let Peace Rule", music: "Extended G Major harmony (whole notes)", time: "13 min", level: "Beginner" }
          ]}
        />

        {/* 9. Bold Rhythms of Strength */}
        <LessonCard
          title="Bold Rhythms of Strength"
          subtitle="Strong, steady beats conveying power"
          gradient="from-red-500/20 to-orange-600/20"
          iconGradient="from-red-500 to-orange-600"
          icon={Target}
          concept="Feel God's strength through bold, steady rhythms and powerful chordal patterns."
          lessons={[
            { title: "Psalm 18:1-2", subtitle: "The Lord is My Rock", music: "Steady 4/4 march in C (100 BPM, strong downbeats)", time: "12 min", level: "Intermediate" },
            { title: "Exodus 15:2", subtitle: "The Lord is My Strength", music: "Powerful quarter notes in D Major (110 BPM)", time: "11 min", level: "Intermediate" },
            { title: "Philippians 4:13", subtitle: "I Can Do All Things", music: "Driving rhythm in G Major (120 BPM)", time: "10 min", level: "Beginner" },
            { title: "Isaiah 40:31", subtitle: "Mount Up with Wings", music: "Bold march in F Major (105 BPM)", time: "13 min", level: "Intermediate" }
          ]}
        />

        {/* 10. Warm Harmonies of Love */}
        <LessonCard
          title="Warm Harmonies of Love"
          subtitle="Rich, warm chords expressing divine love"
          gradient="from-pink-500/20 to-rose-500/20"
          iconGradient="from-pink-400 to-rose-500"
          icon={Music}
          concept="Experience God's love through rich, warm harmonies with added color tones."
          lessons={[
            { title: "1 John 4:8", subtitle: "God is Love", music: "Cmaj7-Am7-Fmaj7-G7 (warm jazz voicings)", time: "14 min", level: "Advanced" },
            { title: "1 Corinthians 13:4-8", subtitle: "Love is Patient", music: "Gmaj9-Em7-Cmaj7-D9sus4", time: "16 min", level: "Advanced" },
            { title: "John 3:16", subtitle: "For God So Loved", music: "F-Dm7-Bbmaj7-C7 (rich harmony)", time: "13 min", level: "Intermediate" },
            { title: "Romans 8:38-39", subtitle: "Nothing Separates", music: "Eb-Cm7-Abmaj7-Bb9", time: "15 min", level: "Advanced" }
          ]}
        />

        {/* 11. Reverent Tempos of Worship */}
        <LessonCard
          title="Reverent Tempos of Worship"
          subtitle="Slow, meditative rhythms for adoration"
          gradient="from-indigo-500/20 to-blue-600/20"
          iconGradient="from-indigo-400 to-blue-600"
          icon={BookOpen}
          concept="Enter God's presence through slow, reverent tempos that invite meditation and worship."
          lessons={[
            { title: "Psalm 95:6", subtitle: "Come, Let Us Worship", music: "Adagio in D Major (65 BPM, dotted rhythms)", time: "17 min", level: "Intermediate" },
            { title: "Revelation 4:11", subtitle: "Worthy is the Lord", music: "Slow 3/4 in G Major (58 BPM)", time: "16 min", level: "Beginner" },
            { title: "Isaiah 6:3", subtitle: "Holy, Holy, Holy", music: "Reverent 4/4 in C Major (60 BPM)", time: "15 min", level: "Intermediate" },
            { title: "John 4:24", subtitle: "Worship in Spirit", music: "Contemplative in F Major (55 BPM)", time: "18 min", level: "Advanced" }
          ]}
        />

        {/* 12. Rhythmic Patterns of Gratitude */}
        <LessonCard
          title="Rhythmic Patterns of Gratitude"
          subtitle="Joyful syncopation expressing thanks"
          gradient="from-orange-500/20 to-amber-500/20"
          iconGradient="from-orange-400 to-amber-500"
          icon={Star}
          concept="Express gratitude through joyful, syncopated rhythms that celebrate God's goodness."
          lessons={[
            { title: "Psalm 100:4", subtitle: "Enter with Thanksgiving", music: "Syncopated C Major (off-beat accents)", time: "10 min", level: "Intermediate" },
            { title: "1 Thessalonians 5:18", subtitle: "Give Thanks", music: "Swing rhythm in G Major (dotted 8ths)", time: "12 min", level: "Advanced" },
            { title: "Colossians 3:17", subtitle: "Do All with Thanks", music: "Rhythmic pattern in D Major", time: "11 min", level: "Intermediate" },
            { title: "Psalm 107:1", subtitle: "Give Thanks to the Lord", music: "Upbeat syncopation in F Major", time: "9 min", level: "Beginner" }
          ]}
        />

        {/* 13. Gentle Intervals of Humility */}
        <LessonCard
          title="Gentle Intervals of Humility"
          subtitle="Small melodic steps showing meekness"
          gradient="from-slate-500/20 to-gray-500/20"
          iconGradient="from-slate-400 to-gray-500"
          icon={Volume2}
          concept="Learn humility through small, stepwise melodic intervals that avoid large dramatic leaps."
          lessons={[
            { title: "Philippians 2:3-4", subtitle: "Consider Others", music: "Stepwise motion C-D-E-D-C (no leaps)", time: "13 min", level: "Beginner" },
            { title: "James 4:10", subtitle: "Humble Yourselves", music: "Descending steps G-F-E-D-C", time: "12 min", level: "Beginner" },
            { title: "Matthew 5:5", subtitle: "Blessed are the Meek", music: "Gentle F-G-F-E-D progression", time: "14 min", level: "Intermediate" },
            { title: "1 Peter 5:6", subtitle: "Humble Under God's Hand", music: "Small intervals D-E-D-C-D", time: "11 min", level: "Beginner" }
          ]}
        />

        {/* 14. Unified Chords of Fellowship */}
        <LessonCard
          title="Unified Chords of Fellowship"
          subtitle="Blended voices creating harmony"
          gradient="from-cyan-500/20 to-teal-500/20"
          iconGradient="from-cyan-400 to-teal-500"
          icon={Award}
          concept="Experience unity through perfectly blended chords where multiple voices create one sound."
          lessons={[
            { title: "Psalm 133:1", subtitle: "Dwell in Unity", music: "4-part harmony: C-E-G-C (SATB)", time: "15 min", level: "Advanced" },
            { title: "Ephesians 4:3", subtitle: "Unity of the Spirit", music: "Close voicing G-B-D-G (tight harmony)", time: "14 min", level: "Intermediate" },
            { title: "Acts 2:42", subtitle: "Fellowship Together", music: "Blended F-A-C-F (4 voices)", time: "13 min", level: "Intermediate" },
            { title: "1 Corinthians 12:12", subtitle: "One Body, Many Parts", music: "D-F#-A-D (unified chord)", time: "16 min", level: "Advanced" }
          ]}
        />

        {/* 15. Musical Resolution of Redemption */}
        <LessonCard
          title="Musical Resolution of Redemption"
          subtitle="Tension resolving to perfect peace"
          gradient="from-violet-500/20 to-purple-600/20"
          iconGradient="from-violet-400 to-purple-600"
          icon={Music}
          concept="Experience redemption through musical tension (dissonance) resolving into perfect consonance."
          lessons={[
            { title: "Isaiah 53:5", subtitle: "By His Wounds We Are Healed", music: "G7 tension → C Major resolution", time: "16 min", level: "Advanced" },
            { title: "Romans 3:23-24", subtitle: "Justified Freely", music: "D7 → G Major (V-I cadence)", time: "15 min", level: "Intermediate" },
            { title: "Ephesians 1:7", subtitle: "Redemption Through Blood", music: "E7 → Am resolution (minor)", time: "17 min", level: "Advanced" },
            { title: "Colossians 1:13-14", subtitle: "Rescued from Darkness", music: "Bb7 → Eb Major (powerful resolution)", time: "14 min", level: "Intermediate" },
            { title: "Titus 2:14", subtitle: "He Redeemed Us", music: "F#7 → B Major (dramatic resolve)", time: "18 min", level: "Advanced" }
          ]}
        />

      </div>
    </div>
  );
}
