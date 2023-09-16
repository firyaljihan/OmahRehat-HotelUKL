const { request, response } = require("express")
const modelUser = require("../models/index").user
const Op = require('sequelize').Op
const path  = require("path")
const upload = require(`./upload-foto`).single(`foto`)
const fs = require(`fs`)
const md5 = require(`md5`)
const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"

exports.login = async (request, response) => {
    try{
        const params = {
            email: request.body.email,
            password: md5(request.body.password),
        };

        const findUser = await modelUser.findOne({where:params});
        if (findUser == null){
            return response.status(404).json({
                message: "email or password doesn't match",
                err: error,
            });
        }
        console.log(findUser)
        let tokenPayload = {
            id: findUser.id,
            email: findUser.email,
            role: findUser.role,
        };
        tokenPayload = JSON.stringify(tokenPayload);
        let token =  jsonwebtoken.sign(tokenPayload, SECRET_KEY);
        
        return response.status(200).json({
            message: "success login",
            data: {
                token: token,
                id: findUser.id,
                email: findUser.email,
                role: findUser.role,
            },
        });
    }
    catch(error){
        return response.status(500).json({
            message: "internal error",
            err: error,
        });
    }
};

exports.getAllUser = async (request, response) => {
    let users = await modelUser.findAll({
        order : [['createdAt', 'DESC']],
    })
    if (users.length === 0) {
        return response.json({
          success: true,
          data: [],
          message: `Data tidak ditemukan`,
        });
      }
    return response.json({
    success: true,
    data: users,
    message: `ini adalah semua data usernya kanjeng ratu`
})
}

exports.getAllReceptionists = async (request, response) => {
    try {
      let resepsionis = await modelUser.findAll({
        where: {
          role: 'resepsionis' // Ganti dengan nilai yang sesuai dengan role "resepsionis" dalam basis data Anda
        },
        order: [['createdAt', 'DESC']],
      });
  
      if (resepsionis.length === 0) {
        return response.json({
          success: true,
          data: [],
          message: `Tidak ada resepsionis yang ditemukan`,
        });
      }
  
      return response.json({
        success: true,
        data: resepsionis,
        message: `Ini adalah semua data resepsionis`,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        success: false,
        message: `Terjadi kesalahan dalam mengambil data resepsionis`,
      });
    }
  };
  
  
exports.findUser = async (request, response) => {
    let nama_user = request.body.nama_user
    let email = request.body.email
    let role = request.body.role

    if (!nama_user && !email && !role) {
        return response.status(400).json({
          success: false,
          message: 'Minimal satu parameter pencarian harus diisi'
        });
      }

    let users = await modelUser.findAll({
        where: {
            [Op.and]: [
                { nama_user: { [Op.substring]: nama_user } },
                { email: { [Op.substring]: email } },
                { role: { [Op.substring]: role} }
            ]
        }
    })

    if (users.length === 0) {
        return response.status(404).json({
            success: false,
            message: 'Data tidak ditemukan'
        });
    }
    
    return response.json({
        success: true,
        data: users,
        message: `berikut data yang anda minta yang mulia`
    })
}

exports.addUser = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        
        if (!request.file) {
            return response.json({ message: `Nothing to Upload`
        })
    }
    
    let newUser = {
        nama_user: request.body.nama_user,
        foto: request.file.filename,
        email: request.body.email,
        password: md5(request.body.password),
        role: request.body.role,
    }
    if (newUser.nama_user === '' || newUser.email==='' || newUser.email==='' ||newUser.password==='' || newUser.role === '') {
        return response.json({
            success: false,
            message: 'Semua data harus diisi'
        })
    }
    
    modelUser.create(newUser).then(result => {
        return response.json({
            success: true,
            email: result.email,
            role: result.role,
            message: `User telah ditambahkan`
        })
    })
    
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
})
}

exports.updateUser = (request, response) => {
    upload(request, response, async (error) => {
      if (error) {
        return response.json({ message: error });
      }
  
      let idUser = request.params.id;
  
      let dataUser = {
          nama_user: request.body.nama_user,
          // foto: request.file.filename,
          email: request.body.email,
          password: md5(request.body.password),
          role: request.body.role
      };
      if (request.file && request.file.filename) {
        dataUser.foto = request.file.filename;
      }
      if (request.file) {
        const selectedUser = await modelUser.findOne({
          where: { id: idUser },
        });
  
        const oldFotoUser = selectedUser.foto;
  
        const patchFoto = path.join(__dirname, `../foto`, oldFotoUser);
  
        if (fs.existsSync(patchFoto)) {
          fs.unlink(patchFoto, (error) => console.log(error));
        }
        dataUser.foto = request.file.filename;
      }
  
      modelUser
        .update(dataUser, { where: { id: idUser } })
        .then((result) => {
          return response.json({
            success: true,
            message: `Data user has been update`,
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
        


exports.deleteUser = async (request, response) => {
    const id = request.params.id
    const user = await modelUser.findOne({ where: { id: id } })
    if (!user) {
        return response.json({
            success: false,
            message: `User with id ${id} not found`
        })
    }
    const oldFotoUser = user.foto
    const pathFoto = path.join(__dirname, `../foto`, oldFotoUser)
    
    if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, error => console.log(error))
    }
    
    modelUser.destroy({ where: { id: id } })
    .then(result => {
        return response.json({
            success: true,
            message: `Data user has been deleted`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}