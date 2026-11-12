# LaLiga Radar ⚽

Die spanische Liga live, als installierbare Web-App (PWA).

- **Spiele**: alle 38 Spieltage, Live-Ergebnisse (alle 30 s aktualisiert), verlegte Spiele markiert
- **Spieldetails**: Spielverlauf (Tore, Karten, Wechsel), Statistik-Vergleich, Aufstellungen auf dem Spielfeld, Bank
- **Tabelle**: Gesamt / Heim / Auswärts, Form der letzten 5 Spiele, Europapokal- und Abstiegszonen
- **Teams**: Form, Heim-/Auswärtsbilanz, nächste Spiele, letzte Ergebnisse, Kader mit Einsätzen und Toren
- **Mein Team**: Lieblingsteam markieren – Countdown zum nächsten Spiel, Hervorhebung überall
- **Statistik**: Tabellenverlauf je Spieltag, Torjäger, Vorlagen, Tore pro Spieltag, Liga-Kennzahlen
- **News**: aktuelle Artikel (Englisch)

Daten: ESPN (inoffizielle öffentliche Schnittstelle), Spieltage: [openfootball](https://github.com/openfootball/football.json). Diagramme mit [Chart.js](https://www.chartjs.org).
Inoffiziell – nicht mit LaLiga oder ESPN verbunden.

## Lokal starten

```bash
python -m http.server 8767
```
