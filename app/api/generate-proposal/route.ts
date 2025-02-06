import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Simpan API Key di `.env.local`
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}");

interface FormData {
  judulKegiatan: string;
  latarBelakang: string;
  gambaranKegiatan: string;
  sasaranPeserta: string[];
  deskripsiKegiatan: string;
  rencanaAnggaran: string;
  susunanPanitia: string[];
}

async function generateProposalContent(formData: FormData): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Anda adalah AI yang membantu membuat proposal kegiatan mahasiswa dengan format formal dan menarik.",
        },
        {
          role: "user",
          content: `Buatkan proposal kegiatan dengan format berikut:
          Judul Kegiatan: ${formData.judulKegiatan}
          Latar Belakang: ${formData.latarBelakang}
          Gambaran Kegiatan: ${formData.gambaranKegiatan}
          Sasaran Peserta: ${formData.sasaranPeserta.join(", ")}
          Deskripsi Kegiatan: ${formData.deskripsiKegiatan}
          Rencana Anggaran: ${formData.rencanaAnggaran}
          Susunan Panitia: ${formData.susunanPanitia.join(", ")}

          Pastikan proposal ditulis dengan format yang profesional dan detail.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Generate proposal dari ChatGPT
    const proposalText = await generateProposalContent(formData);

    // Setup Google Docs API
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive"],
    });

    const docs = google.docs({ version: "v1", auth });

    // Buat dokumen baru
    const doc = await docs.documents.create({
      requestBody: { title: formData.judulKegiatan },
    });

    const documentId = doc.data.documentId!;

    // Format isi proposal
    const content = [
      { insertText: { location: { index: 1 }, text: `PROPOSAL KEGIATAN\n\n${formData.judulKegiatan}\n\n` } },
      { insertText: { location: { index: 2 }, text: `Latar Belakang:\n${formData.latarBelakang}\n\n` } },
      { insertText: { location: { index: 3 }, text: `Gambaran Kegiatan:\n${formData.gambaranKegiatan}\n\n` } },
      { insertText: { location: { index: 4 }, text: `Sasaran Peserta:\n${formData.sasaranPeserta.join(", ")}\n\n` } },
      { insertText: { location: { index: 5 }, text: `Deskripsi Kegiatan:\n${formData.deskripsiKegiatan}\n\n` } },
      { insertText: { location: { index: 6 }, text: `Rencana Anggaran:\n${formData.rencanaAnggaran}\n\n` } },
      { insertText: { location: { index: 7 }, text: `Susunan Panitia:\n${formData.susunanPanitia.join(", ")}\n\n` } },
      { insertText: { location: { index: 8 }, text: `\n\nIsi Proposal:\n${proposalText}` } },
    ];

    // Tambahkan konten ke Google Docs
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests: content },
    });

    return NextResponse.json({ docUrl: `https://docs.google.com/document/d/${documentId}` }, { status: 200 });
  } catch (error) {
    console.error("Error generating proposal:", error);
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 });
  }
}
