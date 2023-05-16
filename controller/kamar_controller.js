const { request, response } = require("express")
const kamarModel = require(`../models/index`).kamar
const tipe_kamarModel = require(`../models/index`).tipe_kamar


exports.getAllKamar = async (request, response) => {
    let kamars = await kamarModel.findAll({
      include: {
        model: tipe_kamarModel,
        attributes: ['nama_tipe_kamar']
      }
    });
    return response.json({
      success: true,
      data: kamars,
      message: "All rooms have been loaded",
    });
  };

exports.findKamar = async (request, response) => {

    try{
        let params = {
            nomor_kamar : request.body.nomor_kamar
        }

        console.log(params.nomor_kamar)
        try{
            const results = await kamarModel.findAll({
                where : params
            })
            if (results.length === 0) {
                return response.status(404).json({
                  success: false,
                  message: 'Data tidak ditemukan'
                });
              }
            return response.json({
                result : results
            })
            // const result = await sequelize.query(
            //     `Select * from kamars"`
            // );
        }catch(err){
            response.json({
                message: "jihan dong",
                error: err

            })
        }
    }catch(err){
        response.json(err)
    }
   
}

exports.addKamar = async (request, response) => {

    let newKamar = {
        nomor_kamar: request.body.nomor_kamar,
        tipeKamarId: request.body.tipeKamarId,

    }
    if (newKamar.nomor_kamar === '' || newKamar.tipeKamarId==='' ) {
        return response.json({
            success: false,
            message: 'Semua data harus diisi'
        })
    }
    console.log(newKamar);
    let tipe_kamar = await tipe_kamarModel.findOne({
        where: {
            id: newKamar.tipeKamarId,
        },
    })
    let tes = newKamar.tipeKamarId == tipe_kamar.id
    console.log(tes)
    if (tes) {
        kamarModel.create(newKamar).then((result) => {
            return response.json({
                success: true,
                data: result,
                message: `kamar telah ditambahkan`
            })
        })

            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    } else {
        return response.json({
            success: false,
            message: "Room types doesn't exist"
        })
    }
}




exports.updateKamar = async (request, response) => {

    let id = request.params.id
    let kamar = {
        nomor_kamar: request.body.nomor_kamar,
        tipeKamarId: request.body.tipeKamarId,
    }
    if (kamar.nomor_kamar === '' || kamar.tipeKamarId==='') {
        return response.json({
            success: false,
            message: 'Semua data harus diisi'
        })
    }
    kamarModel.update(kamar, { where: { id: id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data terupdate`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: 'gabisa'
            })
        })
}


exports.deleteKamar = async (request, response) => {
    let id = request.params.id
    if (!id) {
        return response.json({
            success: false,
            message: `User with id ${id} not found`
        })
    }
    kamarModel.destroy({ where: { id: id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data tipe kamar has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}