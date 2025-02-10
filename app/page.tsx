"use client"

import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState({
    judulKegiatan: '',
    latarBelakang: '',
    gambaranKegiatan: '',
    sasaranPeserta: [],
    deskripsiKegiatan: '',
    rencanaAnggaran: '',
    susunanPanitia: [{ nama: '', jabatan: '', nim: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSasaranPesertaChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      sasaranPeserta: value.split(',')
    });
  };

  const handleSusunanPanitiaChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSusunanPanitia = formData.susunanPanitia.map((item, i) => 
      i === index ? { ...item, [name]: value } : item
    );
    setFormData({
      ...formData,
      susunanPanitia: updatedSusunanPanitia
    });
  };

  const addPanitia = () => {
    setFormData({
      ...formData,
      susunanPanitia: [...formData.susunanPanitia, { nama: '', jabatan: '', nim: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/generate-proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(`Dokumen berhasil dibuat: ${data.docUrl}`);
  };

  return (
    <div className="flex flex-col justify-center items-center h-fit py-10 bg-gradient-to-tr from-blue-500 to-blue-300">
      <h1 className='text-3xl font-bold font-mono pb-4'>DTETI Proposal Maker</h1>
      <div className="container frosted-glass p-8 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Judul Kegiatan</label>
            <input type="text" name="judulKegiatan" value={formData.judulKegiatan} onChange={handleChange} className="w-full p-2 rounded text-black" />
          </div>
          <div>
            <label>Latar Belakang</label>
            <textarea name="latarBelakang" value={formData.latarBelakang} onChange={handleChange} className="w-full p-2 rounded text-black"></textarea>
          </div>
          <div>
            <label>Gambaran Kegiatan</label>
            <textarea name="gambaranKegiatan" value={formData.gambaranKegiatan} onChange={handleChange} className="w-full p-2 rounded text-black"></textarea>
          </div>
          <div>
            <label>Sasaran Peserta & Jumlah</label>
            <input type="text" name="sasaranPeserta" value={formData.sasaranPeserta.join(',')} onChange={handleSasaranPesertaChange} className="w-full p-2 rounded text-black" />
          </div>
          <div>
            <label>Deskripsi Kegiatan</label>
            <textarea name="deskripsiKegiatan" value={formData.deskripsiKegiatan} onChange={handleChange} className="w-full p-2 rounded text-black"></textarea>
          </div>
          <div>
            <label>Rencana Anggaran</label>
            <textarea name="rencanaAnggaran" value={formData.rencanaAnggaran} onChange={handleChange} className="w-full p-2 rounded text-black"></textarea>
          </div>
          <div>
            <label>Susunan Panitia</label>
            {formData.susunanPanitia.map((panitia, index) => (
              <div key={index} className="mb-4">
                <input type="text" name="nama" placeholder="Nama" value={panitia.nama} onChange={(e) => handleSusunanPanitiaChange(index, e)} className="w-full p-2 rounded text-black mb-2" />
                <input type="text" name="jabatan" placeholder="Jabatan" value={panitia.jabatan} onChange={(e) => handleSusunanPanitiaChange(index, e)} className="w-full p-2 rounded text-black mb-2" />
                <input type="text" name="nim" placeholder="NIM" value={panitia.nim} onChange={(e) => handleSusunanPanitiaChange(index, e)} className="w-full p-2 rounded text-black" />
              </div>
            ))}
            <button type="button" onClick={addPanitia} className="mt-2 p-2 bg-blue-500 text-white rounded">Tambah Panitia</button>
          </div>
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-800 hover:shadow-xl transition-all">Generate Proposal</button>
        </form>
      </div>
    </div>
  );
};

export default Page;