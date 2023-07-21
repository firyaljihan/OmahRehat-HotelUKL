const { request, response } = require("express");
const tipeModel = require(`../models/index`).tipe_kamar;
const Op = require(`sequelize`).Op;
const upload = require(`./upload-foto`).single(`foto`);
const path = require("path");
const fs = require(`fs`);

exports.getAllTipeKamar = async (request, response) => {
  let tipe_kamars = await tipeModel.findAll();
  if (tipe_kamars.length === 0) {
    return response.json({
      success: true,
      data: [],
      message: `Data tidak ditemukan`,
    });
  }
  return response.json({
    success: true,
    data: tipe_kamars,
    message: `semua data sukses ditampilkan`,
  });
};

exports.findTipeKamar = async (request, response) => {
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let harga = request.body.harga;

  if (!nama_tipe_kamar && !harga) {
    return response.status(400).json({
      success: false,
      message: "Minimal satu parameter pencarian harus diisi",
    });
  }
  let tipe_kamars = await tipe_kamarModel.findAll({
    where: {
      [Op.and]: [
        { nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } },
        { harga: { [Op.substring]: harga } },
      ],
    },
  });
  if (tipe_kamars.length === 0) {
    return response.status(404).json({
      success: false,
      message: "Data tidak ditemukan",
    });
  }

  return response.json({
    success: true,
    data: tipe_kamars,
    message: `ini tipe kamar yang anda cari yang mulia`,
  });
};

//menambah data
exports.addTipeKamar = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to upload` });
    }

    let newType = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
      foto: request.file.filename,
    };

    console.log(newType);

    tipeModel
      .create(newType)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Type Room has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengupdate salah satu data
exports.updateTipeKamar = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    let idType = request.params.id;

    let dataType = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
      // foto: request.file.filename,
    };
    if (request.file && request.file.filename) {
      dataType.foto = request.file.filename;
    }

    if (request.file) {
      const selectedUser = await tipeModel.findOne({
        where: { id: idType },
      });

      const oldFotoUser = selectedUser.foto;

      const patchFoto = path.join(__dirname, `../foto_tipe_kamar`, oldFotoUser);

      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }
      dataType.foto = request.file.filename;
    }

    tipeModel
      .update(dataType, { where: { id: idType } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data room type has been update`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};


exports.deleteTipeKamar = async (request, response) => {
  const id = request.params.id;
  const tipe_kamar = await tipe_kamarModel.findOne({ where: { id: id } });
  if (!tipe_kamar) {
    return response.json({
      success: false,
      message: `Tipe kamar with id ${id} not found`,
    });
  }
  const oldFotoTipeKamar = tipe_kamar.foto;
  const pathFoto = path.join(__dirname, `../foto`, oldFotoTipeKamar);

  if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, (error) => console.log(error));
  }

  tipe_kamarModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data tipe kamar has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
