# Galerie Daten - JSON Struktur

## Verwendung

Jedes Bild in der Galerie wird durch eine eigene JSON-Datei repräsentiert.

### Dateinamen-Konvention
- Format: `image-XXX.json` (z.B. `image-001.json`, `image-002.json`)
- Die Nummerierung sollte fortlaufend sein

### JSON-Struktur

```json
{
  "image-path": "Pics/bildname.jpg",
  "image-title": "Titel des Bildes",
  "artist-name": "Name des Künstlers",
  "text-description": "Ausführliche Beschreibung des Bildes",
  "hashtags": ["tag1", "tag2", "tag3"]
}
```

### Felder Beschreibung

- **image-path**: Relativer Pfad zum Bild (normalerweise im `Pics/` Ordner)
- **image-title**: Der Titel oder Name des Kunstwerks
- **artist-name**: Name des Künstlers/der Künstlerin
- **text-description**: Detaillierte Beschreibung des Werks
- **hashtags**: Array von Hashtags für Kategorisierung und Suche

## Neues Bild hinzufügen

1. Lege das Bild im `Pics/` Ordner ab
2. Erstelle eine neue JSON-Datei mit der nächsten Nummer (z.B. `image-005.json`)
3. Fülle alle Felder aus
4. Die Galerie lädt automatisch alle JSON-Dateien beim Seitenaufruf
