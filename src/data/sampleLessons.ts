export const sampleLessons = [
  {
    title: "Psalm 23: The Lord is My Shepherd",
    description: "Learn this beloved psalm through interactive activities",
    song_id: "psalm_23",
    difficulty_level: "beginner",
    order_index: 1,
    category: "Torah",
    is_published: true,
    lyrics: [
      { phrase: "The Lord is my shepherd", syllables: ["The", "Lord", "is", "my", "shep", "herd"] },
      { phrase: "I shall not want", syllables: ["I", "shall", "not", "want"] },
      { phrase: "He maketh me to lie down in green pastures", syllables: ["He", "ma", "keth", "me", "to", "lie", "down", "in", "green", "pas", "tures"] },
      { phrase: "He leadeth me beside the still waters", syllables: ["He", "lead", "eth", "me", "be", "side", "the", "still", "wa", "ters"] }
    ],
    melody_data: {
      notes: ["C4", "D4", "E4", "F4", "G4", "A4", "G4", "F4"],
      rhythm: [1, 1, 1, 1, 2, 1, 1, 2]
    },
    activities: [
      {
        activity_type: "call-response",
        activity_order: 1,
        title: "Call and Response",
        instructions: "Listen to the call phrase and respond with the next phrase",
        content: {
          pairs: [
            { call: "The Lord is my shepherd", response: "I shall not want" },
            { call: "He maketh me to lie down", response: "in green pastures" }
          ]
        },
        correct_answers: {},
        hints: ["Listen carefully to the melody", "The response follows naturally"],
        max_attempts: 3,
        points_possible: 20,
        time_limit_seconds: 60
      },
      {
        activity_type: "fill-blank",
        activity_order: 2,
        title: "Fill in the Blanks",
        instructions: "Complete the missing words in the psalm",
        content: {
          text: "The ___ is my shepherd; I shall not ___. He maketh me to lie down in ___ pastures.",
          blanks: [
            { index: 0, answer: "Lord", hints: ["Begins with L", "Four letters", "Another word for God"] },
            { index: 1, answer: "want", hints: ["Rhymes with haunt", "Four letters", "Means to lack"] },
            { index: 2, answer: "green", hints: ["Color", "Five letters", "Describes fresh grass"] }
          ],
          wordBank: ["Lord", "want", "green", "blue", "God", "need"]
        },
        correct_answers: { blanks: ["Lord", "want", "green"] },
        hints: ["Think about what shepherds provide", "Focus on the theme of provision"],
        max_attempts: 3,
        points_possible: 30,
        time_limit_seconds: 120
      },
      {
        activity_type: "melody-map",
        activity_order: 3,
        title: "Map the Melody",
        instructions: "Match the lyrics to the correct notes",
        content: {
          lyrics: ["The", "Lord", "is", "my", "shep", "herd"],
          notes: ["C4", "D4", "E4", "F4", "G4", "A4"],
          melodicContour: "ascending"
        },
        correct_answers: {
          mapping: {
            "The": "C4",
            "Lord": "D4",
            "is": "E4",
            "my": "F4",
            "shep": "G4",
            "herd": "A4"
          }
        },
        hints: ["The melody rises with each word", "Start with the lowest note"],
        max_attempts: 3,
        points_possible: 25,
        time_limit_seconds: 180
      },
      {
        activity_type: "text-grouping",
        activity_order: 4,
        title: "Categorize Phrases",
        instructions: "Group the phrases by their theme",
        content: {
          phrases: [
            "The Lord is my shepherd",
            "I shall not want",
            "He maketh me to lie down",
            "in green pastures",
            "beside the still waters",
            "He restoreth my soul"
          ],
          categories: ["Provision", "Rest", "Restoration"]
        },
        correct_answers: {
          groups: {
            "Provision": ["The Lord is my shepherd", "I shall not want"],
            "Rest": ["He maketh me to lie down", "in green pastures", "beside the still waters"],
            "Restoration": ["He restoreth my soul"]
          }
        },
        hints: ["Think about what each phrase describes", "Provision = giving", "Rest = peace"],
        max_attempts: 3,
        points_possible: 25,
        time_limit_seconds: 180
      }
    ]
  },
  {
    title: "Amazing Grace - Complete Song",
    description: "Learn all verses of this beautiful hymn through combination activities",
    song_id: "amazing_grace",
    difficulty_level: "intermediate",
    order_index: 2,
    category: "Gospel",
    is_published: true,
    lyrics: [
      { phrase: "Amazing grace! How sweet the sound", section: "verse1" },
      { phrase: "That saved a wretch like me", section: "verse1" },
      { phrase: "I once was lost, but now am found", section: "verse2" },
      { phrase: "Was blind, but now I see", section: "verse2" }
    ],
    melody_data: {
      key: "G Major",
      tempo: "Andante",
      timeSignature: "3/4"
    },
    activities: [
      {
        activity_type: "combination-songs",
        activity_order: 1,
        title: "Build the Song",
        instructions: "Arrange the phrases in the correct order to form the complete song",
        content: {
          phraseBlocks: [
            { id: "v1l1", text: "Amazing grace! How sweet the sound", section: "Verse 1", order: 1 },
            { id: "v1l2", text: "That saved a wretch like me", section: "Verse 1", order: 2 },
            { id: "v2l1", text: "I once was lost, but now am found", section: "Verse 2", order: 3 },
            { id: "v2l2", text: "Was blind, but now I see", section: "Verse 2", order: 4 }
          ],
          mode: "reorder"
        },
        correct_answers: {
          order: ["v1l1", "v1l2", "v2l1", "v2l2"]
        },
        hints: ["Start with 'Amazing grace'", "Verse 1 before Verse 2"],
        max_attempts: 5,
        points_possible: 30,
        time_limit_seconds: 240
      },
      {
        activity_type: "partial-text",
        activity_order: 2,
        title: "Complete the Verse",
        instructions: "Given the first line, complete the rest of the verse",
        content: {
          given: "Amazing grace! How sweet the sound",
          options: [
            "That saved a wretch like me",
            "How precious did that grace appear",
            "Through many dangers, toils and snares"
          ]
        },
        correct_answers: {
          answer: "That saved a wretch like me"
        },
        hints: ["The answer follows naturally", "Think about personal salvation"],
        max_attempts: 3,
        points_possible: 20,
        time_limit_seconds: 60
      }
    ]
  }
];
