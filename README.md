# LaLiga Radar

Die spanische Liga live, als installierbare Web-App (PWA).

- **Spiele**: alle 38 Spieltage, Live-Ergebnisse (alle 30 s aktualisiert), verlegte Spiele markiert
- **Spieldetails**: Spielverlauf (Tore, Karten, Wechsel), Statistik-Vergleich, Aufstellungen auf dem Spielfeld, Bank
- **Tabelle**: Gesamt / Heim / Auswärts, Form der letzten 5 Spiele, Europapokal- und Abstiegszonen
- **Teams**: Form, Heim-/Auswärtsbilanz, nächste Spiele, letzte Ergebnisse, Kader mit Einsätzen und Toren
- **Mein Verein**: eigener Bereich mit Vereinsfarben, nächstem Spiel (Countdown), Saisonzahlen, Restprogramm mit Schwierigkeit, Punkteverlauf vs. Tabellenführer und Platz 4, Torschützen, Ausfällen und Vereins-News
- **Benachrichtigungen**: Erinnerung vor Anpfiff, Anpfiff/Halbzeit, Tore mit Torschütze, Rote Karten, Endergebnis (live, solange die App läuft; im Hintergrund gelegentlich per Periodic Background Sync)
- **Statistik**: Tabellenverlauf je Spieltag, Torjäger, Vorlagen, Tore pro Spieltag, Liga-Kennzahlen
- **News**: aktuelle Artikel (Englisch)

Daten: ESPN (inoffizielle öffentliche Schnittstelle), Spieltage: [openfootball](https://github.com/openfootball/football.json). Diagramme mit [Chart.js](https://www.chartjs.org).
Inoffiziell – nicht mit LaLiga oder ESPN verbunden.

## Lokal starten

```bash
python -m http.server 8767
```

Icons: [Tabler Icons](https://tabler.io/icons) (MIT), als SVG eingebettet.
