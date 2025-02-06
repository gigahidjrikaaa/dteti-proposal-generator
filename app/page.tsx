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
    susunanPanitia: []
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

  const handleSusunanPanitiaChange = (e) => {
    const { options } = e.target;
    const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
    setFormData({
      ...formData,
      susunanPanitia: selectedOptions
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
            <select name="susunanPanitia" multiple value={formData.susunanPanitia} onChange={handleSusunanPanitiaChange} className="w-full p-2 rounded text-black">
              <option value="Ketua">Ketua</option>
              <option value="Sekretaris">Sekretaris</option>
              <option value="Bendahara">Bendahara</option>
              <option value="Anggota">Anggota</option>
            </select>
          </div>
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-800 hover:shadow-xl transition-all">Generate Proposal</button>
        </form>
      </div>
    </div>
  );
};

export default Page;