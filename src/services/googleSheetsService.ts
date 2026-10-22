export interface ApprenticeSyncData {
  registeredAt: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  fichaNumber: string;
  programName: string;
  regional: string;
  centroFormacion: string;
  modalidad: string;
  score: number;
  status: 'Aprobado' | 'En Proceso' | 'Pendiente';
  verificationCode: string;
  registeredByEmail?: string;
}

export interface GoogleDriveSheet {
  id: string;
  name: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

const DEFAULT_HEADERS = [
  'Fecha y Hora Registro',
  'Nombre Completo Aprendiz',
  'Tipo Documento',
  'Número Documento',
  'Ficha Caracterización',
  'Programa de Formación',
  'Regional',
  'Centro de Formación',
  'Modalidad',
  'Puntaje Evaluación (%)',
  'Estado Inducción',
  'Código Verificación Certificado',
  'Registrado por (Email)',
];

/**
 * Creates a new Google Sheets spreadsheet in the user's Google Drive
 * formatted with institutional SENA headers and frozen top row.
 */
export const createInductionSpreadsheet = async (
  accessToken: string,
  title: string = 'SENA - Registro Oficial Inducción de Aprendices'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; sheetName: string }> => {
  const requestBody = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Aprendices_Induccion',
          gridProperties: {
            frozenRowCount: 1,
            columnCount: DEFAULT_HEADERS.length + 2,
          },
        },
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Error al crear la hoja de cálculo (${response.status})`
    );
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const sheetName = data.sheets?.[0]?.properties?.title || 'Aprendices_Induccion';
  const spreadsheetUrl =
    data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Insert header row
  await setSheetHeaders(accessToken, spreadsheetId, sheetName);

  return { spreadsheetId, spreadsheetUrl, sheetName };
};

/**
 * Inserts and styles the institutional header row
 */
export const setSheetHeaders = async (
  accessToken: string,
  spreadsheetId: string,
  sheetName: string
) => {
  const range = `${sheetName}!A1:M1`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: [DEFAULT_HEADERS],
      }),
    }
  );

  if (!response.ok) {
    console.warn('Could not write header row values directly', await response.text());
  }
};

/**
 * Fetches the first sheet/tab name dynamically from spreadsheet metadata
 */
export const getFirstSheetName = async (
  accessToken: string,
  spreadsheetId: string
): Promise<string> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(title))`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    return 'Sheet1';
  }

  const data = await res.json();
  return data.sheets?.[0]?.properties?.title || 'Sheet1';
};

/**
 * Appends a single apprentice record to the specified Google Sheet
 */
export const appendApprenticeToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  record: ApprenticeSyncData
): Promise<boolean> => {
  const sheetName = await getFirstSheetName(accessToken, spreadsheetId);
  const rowValues = [
    record.registeredAt || new Date().toLocaleString('es-CO'),
    record.fullName,
    record.documentType,
    record.documentNumber,
    record.fichaNumber,
    record.programName,
    record.regional,
    record.centroFormacion,
    record.modalidad,
    record.score,
    record.status,
    record.verificationCode,
    record.registeredByEmail || 'Sistema SENA',
  ];

  const range = `${sheetName}!A:M`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al guardar el aprendiz en la hoja de cálculo');
  }

  return true;
};

/**
 * Appends multiple apprentice records in batch to the Google Sheet
 */
export const appendBatchToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  records: ApprenticeSyncData[]
): Promise<number> => {
  if (records.length === 0) return 0;

  const sheetName = await getFirstSheetName(accessToken, spreadsheetId);
  const values = records.map((record) => [
    record.registeredAt || new Date().toLocaleString('es-CO'),
    record.fullName,
    record.documentType,
    record.documentNumber,
    record.fichaNumber,
    record.programName,
    record.regional,
    record.centroFormacion,
    record.modalidad,
    record.score,
    record.status,
    record.verificationCode,
    record.registeredByEmail || 'Sincronización Masiva',
  ]);

  const range = `${sheetName}!A:M`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al sincronizar cohorte a Google Sheets');
  }

  return records.length;
};

/**
 * Reads existing records from the Google Sheet
 */
export const readApprenticesFromSheet = async (
  accessToken: string,
  spreadsheetId: string
): Promise<ApprenticeSyncData[]> => {
  const sheetName = await getFirstSheetName(accessToken, spreadsheetId);
  const range = `${sheetName}!A2:M`;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const rows: any[][] = data.values || [];

  return rows
    .filter((row) => row && row[1]) // has learner name
    .map((row) => ({
      registeredAt: row[0] || '',
      fullName: row[1] || '',
      documentType: row[2] || 'CC',
      documentNumber: row[3] || '',
      fichaNumber: row[4] || '',
      programName: row[5] || '',
      regional: row[6] || '',
      centroFormacion: row[7] || '',
      modalidad: row[8] || 'Presencial',
      score: Number(row[9]) || 0,
      status: (row[10] as any) || 'Aprobado',
      verificationCode: row[11] || '',
      registeredByEmail: row[12] || '',
    }));
};

/**
 * Lists spreadsheets accessible via Google Drive for this app
 */
export const listDriveSpreadsheets = async (
  accessToken: string
): Promise<GoogleDriveSheet[]> => {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,createdTime,modifiedTime)&orderBy=modifiedTime desc&pageSize=15`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.files || [];
};
