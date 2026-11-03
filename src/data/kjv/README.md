# Local KJV data pipeline

The complete KJV corpus belongs here as local, versioned data. Each book should be a separate JSON asset so the library can lazy-load books without rendering the entire Bible into the DOM.

Required verse shape:

```json
{
  "id": "psalms-23-1",
  "book": "Psalms",
  "chapter": 23,
  "verse": 1,
  "text": "..."
}
```

The import step must record the exact source edition and attribution in `LICENSES.md`. Do not silently substitute a different translation or edition.
