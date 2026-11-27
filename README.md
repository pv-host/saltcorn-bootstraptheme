# Bootstrap Layout für Saltcorn

`saltcorn-bootstrap-layout` 1.0.0 ist ein eigenes Layout-Plugin für selbst gehostetes Saltcorn. Der Seitenrahmen, die Navigation, das Anmeldelayout und die Layout-Werkstatt sind neu implementiert. Das Paket bringt Bootstrap 5.3.9 mit gebündeltem JavaScript (inklusive Popper), RTL-Stylesheet und Font Awesome Free 5.15.3 für Saltcorn-Symbole mit. Andere Themes und externe CDNs sind nicht erforderlich.

## Installation

1. Das ZIP auf dem Server entpacken, z. B. nach `/opt/saltcorn/plugins/`. Der Ordner `/opt/saltcorn/plugins/saltcorn-bootstrap-layout/` muss direkt die `package.json` enthalten. Bei Docker einen dauerhaften, im Saltcorn-Container lesbaren Pfad verwenden.
2. Als Administrator unter **Einstellungen → Plugins → ⋯ → Add another plugin** den Namen `saltcorn-bootstrap-layout`, Quelle `local` und den vollständigen Ordnerpfad angeben. Alternativ in der Saltcorn-Laufzeit:

   ```sh
   saltcorn install-plugin -d /opt/saltcorn/plugins/saltcorn-bootstrap-layout
   ```

3. Das Zahnrad des neuen Plugins öffnen. Im Formular die gewünschten Werte setzen. Auf einer Testinstanz beginnen: Ein neu installiertes Layout kann direkt zum Standard werden. Falls eine Rolle weiter ein anderes Layout zeigt, ihre Layoutzuordnung prüfen.
4. Bestehende Themes nicht überschreiben oder deinstallieren. Dieses Paket besitzt einen eigenen Namen und eigene Einstellungen. Für einen Rückwechsel das bisherige Theme wieder zuweisen.

Siehe [Saltcorn: lokale Plugin-Installation](https://wiki.saltcorn.com/view/ShowPage/activating-plugins).

## Layout-Parameter

| Einstellung | Auswahl und Wirkung |
|---|---|
| Navigation | Kopfzeile mit horizontalem Menü; Seitenleiste am Anfang oder Ende der Leserichtung; alternativ dauerhaft per Menüschalter geöffneter Offcanvas-Dialog. Bei deutscher Leserichtung bedeutet Anfang links, Ende rechts. |
| Breakpoint | `sm`, `md`, `lg`, `xl`, `xxl`. Unterhalb des gewählten Umbruchpunkts wird das Menü per Schalter geöffnet. Beim dauerhaften Offcanvas bleibt das auf jeder Bildschirmgröße so. |
| Inhaltsbreite | `container`, `container-fluid`, `container-sm` bis `container-xxl`. Saltcorn-Seiten, die ausdrücklich volle Breite anfordern, dürfen diese Vorgabe überschreiben. |
| Seitenleistenraster | 2:10, 3:9, 4:8 oder 5:7 Spalten. Links und rechts sind unabhängig von der gewählten Containerbreite möglich. Bei eingeklappter Leiste erhält der Inhalt die ganze Breite. |
| Position und Abstände | Normale oder mitlaufend sichtbare Kopfzeile (`sticky-top`); `gx-0…5` zwischen Leiste und Inhalt; `px-0…5`, `py-0…5` für den Inhaltsrahmen. |
| Farben | Heller/dunkler Bootstrap-Modus; acht Kontextfarben für die Kopfzeile; `body`, `body-secondary` oder `body-tertiary` als Hintergrund. Optional eigene Primär- und Linkfarbe per Farbwähler. Die Primärfarbe wirkt auf reguläre Primärbuttons und primäre Hintergrund-Utilities, nicht als Neukompilierung aller Bootstrap-Komponenten. |
| Karten | Sechs Eckenstufen entsprechend `rounded-0…5`, ohne Schatten oder `shadow-sm`, `shadow`, `shadow-lg`. |
| Schrift | Systemschrift, Arial, Verdana, Georgia oder Monospace mit lokalen Ersatzschriften; 12–24 px bei 16 px Browser-Standard. Die relative Skalierung berücksichtigt abweichende Browser-Schriftgrößen. |

Die 18 Felder steuern den **Rahmen** der Anwendung. Sie verändern keine gespeicherten Spaltenlayouts, Abfragen, View-Definitionen oder Berechtigungen. Das Raster innerhalb einer einzelnen View wird weiterhin im Saltcorn-Builder festgelegt. Das Plugin ist kein Sass-Editor und kompiliert Bootstrap nicht auf dem Server.

## Layout-Werkstatt

Über **Layout-Werkstatt öffnen** in der Konfiguration oder über `/bootstrap-layout/werkstatt` startet die Admin-Vorschau mit den gespeicherten Einstellungen. Werte ändern, **Vorschau aktualisieren** wählen und das Fenster verkleinern, um den Breakpoint zu prüfen. Die Vorschau verwendet denselben Layout-Renderer wie die Anwendung, aber Mustermenüs und Musterinhalte statt Betriebsdaten.

Die Werkstatt schreibt keine Änderungen zurück. **Gespeicherten Stand laden** verwirft den Versuch. Für die dauerhafte Nutzung dieselben Werte in der Plugin-Konfiguration einstellen. Der Werkstattzugriff setzt Administratorrolle 1 voraus.

### Zwei Startkonfigurationen

- **Arbeitsansicht für Tabellen:** Seitenleiste links, Breakpoint `lg`, `container-fluid`, Raster 2:10, `gx-2`, `px-2`, `py-2`, Kopfzeile `sticky-top`. Die verfügbare Bildschirmbreite bleibt überwiegend für Listen.
- **Portal für Formulare:** Kopfnavigation, `container-lg`, `px-3`, `py-4`, `body-tertiary`, Kartenradius 3, `shadow-sm`. Für ein dauerhaft ruhiges Layout ohne horizontale Menüleiste stattdessen „Offcanvas auf allen Bildschirmgrößen“ wählen.

## Betrieb und Prüfstand

Prüfumgebung: Saltcorn CLI 1.6.4, SQLite, Node.js 20.20.2; neu erzeugte Datenbank ohne zusätzliches Drittanbieter-Theme. Lokal installiert; Anmeldung per HTTP mit CSRF, Laden und Speichern der Plugin-Konfiguration, Wechsel auf dunkle rechte Seitenleiste und Saltcorn-XHR-Teilrendering geprüft. Für alle vier Varianten lieferte die Admin-Vorschau HTML; ohne Anmeldung antwortete sie mit 403. Der gespeicherte Stand blieb nach den Vorschauaufrufen erhalten.

An gerenderten Musterseiten im Browser geprüft: links/rechts tatsächlich vertauschte Spalten bei breitem Fenster; gewählte Primärfarbe am Button; bei 375 px kein horizontaler Überlauf und per Schalter zu öffnender und schließbarer Offcanvas-Dialog. Die Modultests für Parameter, Menüs, Raster und Vorschau laufen ohne Saltcorn per `npm test` (Node 20). Nicht geprüft: sämtliche Drittanbieter-Views, jede Parameterkombination oder die produktive Installation.

Die Navigation verwendet die von Saltcorn für die aktuelle Rolle gelieferten Einträge; Verschachtelung, Suchfeld, normale Links und unterstützte Saltcorn-Modal-/Aktionslinks werden dargestellt. „Mobile Bottom“-Einträge werden ins erreichbare Hauptmenü integriert, nicht als separate untere Leiste ausgegeben. Frei programmierte `javascript:`-Menülinks werden nicht ausgeführt.

## Grundlagen und Lizenzen

Offizielle Dokumentation: [Bootstrap-Container](https://getbootstrap.com/docs/5.3/layout/containers/), [12-Spalten-Raster](https://getbootstrap.com/docs/5.3/layout/grid/), [Spaltenabstände](https://getbootstrap.com/docs/5.3/layout/gutters/) und [Offcanvas](https://getbootstrap.com/docs/5.3/components/offcanvas/). Die Lizenztexte für mitgelieferte Fremdkomponenten befinden sich in `licenses/`.
