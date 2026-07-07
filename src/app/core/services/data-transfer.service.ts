import { Injectable } from '@angular/core';

export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

export type ImportedRecord = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class DataTransferService {
  async readRecords(file: File): Promise<ImportedRecord[]> {
    const text = await file.text();
    const trimmed = text.trim();

    if (!trimmed) {
      return [];
    }

    if (file.name.toLowerCase().endsWith('.json') || trimmed.startsWith('[')) {
      return this.parseJson(trimmed);
    }

    return this.parseCsv(trimmed);
  }

  exportCsv<T>(filename: string, rows: T[], columns: ExportColumn<T>[]): void {
    const header = columns.map(column => this.escapeCsvCell(column.header)).join(';');
    const body = rows
      .map(row => columns.map(column => this.escapeCsvCell(column.value(row))).join(';'))
      .join('\n');

    const content = ['\uFEFF' + header, body].filter(Boolean).join('\n');
    this.downloadFile(filename, content, 'text/csv;charset=utf-8;', 'csv');
  }

  exportPdf<T>(title: string, rows: T[], columns: ExportColumn<T>[]): void {
    const generatedAt = new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());

    const headers = columns.map(column => `<th>${this.escapeHtml(column.header)}</th>`).join('');
    const body = rows.length
      ? rows.map(row => `
          <tr>
            ${columns.map(column => `<td>${this.escapeHtml(column.value(row))}</td>`).join('')}
          </tr>
        `).join('')
      : `<tr><td colspan="${columns.length}">Aucune donnée à exporter.</td></tr>`;

    const html = `
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <title>${this.escapeHtml(title)}</title>
          <style>
            body {
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
              margin: 24px;
              color: #1a1a2e;
            }
            h1 {
              margin: 0 0 8px;
              font-size: 24px;
            }
            p {
              margin: 0 0 20px;
              color: #666;
              font-size: 13px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th,
            td {
              border: 1px solid #d9d9d9;
              padding: 10px 12px;
              text-align: left;
              font-size: 13px;
            }
            th {
              background: #f5f5f5;
              font-weight: 700;
            }
            tr:nth-child(even) td {
              background: #fafafa;
            }
          </style>
        </head>
        <body>
          <h1>${this.escapeHtml(title)}</h1>
          <p>Export généré le ${this.escapeHtml(generatedAt)}</p>
          <table>
            <thead>
              <tr>${headers}</tr>
            </thead>
            <tbody>${body}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const popup = window.open(url, '_blank', 'width=1200,height=900');

    if (!popup) {
      URL.revokeObjectURL(url);
      throw new Error('Impossible d’ouvrir la fenêtre d’export PDF.');
    }

    const cleanup = () => window.setTimeout(() => URL.revokeObjectURL(url), 60_000);

    popup.addEventListener('load', () => {
      popup.focus();
      window.setTimeout(() => popup.print(), 250);
      cleanup();
    }, { once: true });
  }

  getValue(row: ImportedRecord, aliases: string[]): string {
    for (const alias of aliases) {
      const normalized = this.normalizeKey(alias);
      if (normalized in row) {
        return row[normalized];
      }
    }

    return '';
  }

  normalizeKey(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  private parseJson(raw: string): ImportedRecord[] {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Le fichier JSON doit contenir un tableau d’objets.');
    }

    return parsed
      .filter(item => item && typeof item === 'object' && !Array.isArray(item))
      .map(item => this.normalizeRecord(item as Record<string, unknown>));
  }

  private parseCsv(raw: string): ImportedRecord[] {
    const delimiter = this.detectDelimiter(raw);
    const rows = this.parseDelimitedText(raw, delimiter)
      .map(row => row.map(cell => cell.trim()))
      .filter(row => row.some(cell => cell.length > 0));

    if (!rows.length) {
      return [];
    }

    const [headerRow, ...dataRows] = rows;
    const headers = headerRow.map(header => this.normalizeKey(header));

    return dataRows.map(row => {
      const record: ImportedRecord = {};
      headers.forEach((header, index) => {
        if (header) {
          record[header] = row[index] ?? '';
        }
      });
      return record;
    });
  }

  private normalizeRecord(record: Record<string, unknown>): ImportedRecord {
    return Object.entries(record).reduce<ImportedRecord>((accumulator, [key, value]) => {
      accumulator[this.normalizeKey(key)] = value == null ? '' : String(value).trim();
      return accumulator;
    }, {});
  }

  private detectDelimiter(raw: string): string {
    const sample = raw.split(/\r?\n/, 1)[0] ?? '';
    const delimiters = [';', ',', '\t'];
    return delimiters.reduce((best, current) =>
      sample.split(current).length > sample.split(best).length ? current : best
    , ';');
  }

  private parseDelimitedText(raw: string, delimiter: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let index = 0; index < raw.length; index += 1) {
      const char = raw[index];
      const next = raw[index + 1];

      if (char === '"') {
        if (insideQuotes && next === '"') {
          currentCell += '"';
          index += 1;
        } else {
          insideQuotes = !insideQuotes;
        }
        continue;
      }

      if (!insideQuotes && char === delimiter) {
        currentRow.push(currentCell);
        currentCell = '';
        continue;
      }

      if (!insideQuotes && (char === '\n' || char === '\r')) {
        if (char === '\r' && next === '\n') {
          index += 1;
        }
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        continue;
      }

      currentCell += char;
    }

    currentRow.push(currentCell);
    rows.push(currentRow);
    return rows;
  }

  private escapeCsvCell(value: string | number | null | undefined): string {
    const cell = value == null ? '' : String(value);
    return `"${cell.replace(/"/g, '""')}"`;
  }

  private escapeHtml(value: string | number | null | undefined): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private downloadFile(filename: string, content: string, mimeType: string, extension: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${filename}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
