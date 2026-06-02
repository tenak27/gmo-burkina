import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Non autorisé' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    const body = await req.json();
    const { fileBase64, mimeType, slot, label } = body;

    if (!fileBase64) return Response.json({ error: 'Aucun fichier fourni' }, { status: 400 });

    // Decode base64 to binary
    const binaryString = atob(fileBase64);
    const fileBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      fileBytes[i] = binaryString.charCodeAt(i);
    }

    const fileMime = mimeType || 'image/jpeg';
    const ext = fileMime.split('/')[1] || 'jpg';
    const filename = `${slot || 'image'}_${(label || 'file').replace(/[^a-z0-9]/gi, '_')}.${ext}`;

    // Ensure the GMO Images folder exists
    const folderName = 'GMO Site Vitrine — Images';
    const folderSearchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`)}&fields=files(id,name)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const folderSearchData = await folderSearchRes.json();

    let folderId;
    if (folderSearchData.files && folderSearchData.files.length > 0) {
      folderId = folderSearchData.files[0].id;
    } else {
      const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder' }),
      });
      const folder = await createFolderRes.json();
      folderId = folder.id;
    }

    // Upload file to Drive using multipart
    const metadata = JSON.stringify({ name: filename, parents: [folderId] });
    const boundary = 'gmo_boundary_xyz123';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const encoder = new TextEncoder();
    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${metadata}`;
    const dataHeader = `${delimiter}Content-Type: ${fileMime}\r\n\r\n`;
    const metadataBytes = encoder.encode(metadataPart);
    const dataHeaderBytes = encoder.encode(dataHeader);
    const closeBytes = encoder.encode(closeDelimiter);

    const body2 = new Uint8Array(metadataBytes.length + dataHeaderBytes.length + fileBytes.length + closeBytes.length);
    body2.set(metadataBytes, 0);
    body2.set(dataHeaderBytes, metadataBytes.length);
    body2.set(fileBytes, metadataBytes.length + dataHeaderBytes.length);
    body2.set(closeBytes, metadataBytes.length + dataHeaderBytes.length + fileBytes.length);

    const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: body2,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return Response.json({ error: `Erreur Drive: ${err}` }, { status: 500 });
    }

    const driveFile = await uploadRes.json();

    // Make publicly readable
    await fetch(`https://www.googleapis.com/drive/v3/files/${driveFile.id}/permissions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    });

    const imageUrl = `https://drive.google.com/uc?export=view&id=${driveFile.id}`;
    return Response.json({ success: true, file_url: imageUrl, drive_id: driveFile.id, name: driveFile.name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});