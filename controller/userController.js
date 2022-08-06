const userModel=require("../model/userModel.js")
const validator = require("../validator.js")
const jwt = require("jsonwebtoken")
//const aws = require("../aws")




const registerUser = async (req, res) => {
  try {
    const requestBody = req.body;
   

    if (!validator.isValid(requestBody)) {
      return res.status(400).send({ status: false, message: "Invalid request , Body is required" });
    }

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, msg: "please enter the user details" });
      
    }
    
    let { firstname, lastname, email, phone, password} = requestBody;
    
    if (!validator.isValid(firstname)) {
      return res.status(400).send({ status: false, msg: "please enter the first name" });
    }

    if (!validator.isValid(lastname)) {
      return res.status(400).send({ status: false, msg: "please enter the last name" });
    }

    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, msg: "please enter an email" });
    }

    if (!validator.validEmail(email)) {
      return res.status(400).send({ status: false, msg: "please enter the valid email" });
    }
    let isEmailAlreadyUsed = await userModel.findOne({ email });

    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, msg: `this ${email} is already registered` });
      
    }

    if (!validator.isValid(phone)) {
        return res.status(400).send({ status: false, msg: "please enter the phone no." });
      
    }

    if (!validator.validPhone(phone)) {
        return res.status(400).send({ status: false, msg: "please enter the valid phone no." });
     
    }

    let isPhoneAlreadyUsed = await userModel.findOne({ phone });

    if (isPhoneAlreadyUsed) {
      return res.status(400).send({ status: false, msg: `this ${phone} is already registered` });
    }

    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, msg: "please enter the password" });
    }

    if (!validator.isvalidPassword(password)) {
      return res.status(400).send({ status: false, msg: "please enter the valid password" });
    }

const newUser = {
      firstname,
      lastname,
      email,
      phone,
      password,
    };

    createdUser = await userModel.create(newUser);
    
    res.status(201).send({status: true,msg: "user successfully created",data: createdUser});
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};



////.........................................................................

const loginUser = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!email || !password) return res.status(400).send({ status: false, msg: `Email and Password is mandatory field.` });

    if (!validator.isValid(email)) return res.status(400).send({ status: false, msg: "enter the valid email" });

    if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) return res.status(400).send({ status: false, msg: "email ID is not valid" });

    if (!validator.isValid(password)) return res.status(400).send({ status: false, msg: "Enter the valid Password" });

    if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, msg: "Password length should be 8 to 15" });

    let user = await userModel.findOne({ email: email });
    if (!user)return res.status(400).send({ status: false, msg: "emailId is not correct" });


    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours expiration time
        userId: user._id.toString(),
      },
      "Group24"
    );
    return res.status(200).send({status: true,msg: "login succesfully",data: { userId: user._id, token: token }});
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};






///...............................................................................................

const getProfile = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!validator.isValid(userId.trim())) {
            return res.status(400).send({ status: false, msg: "userId required" })
        }
        let getList = await userModel.findOne({ _id: userId })
        if (!getList) {
            return res.status(404).send({ status: false, msg: "not found " })
        }
       
        return res.status(200).send({ status:true, msg: "user profile details", data: getList })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


/////.updateProfile.........................................................................................................

const updateProfile = async function (req, res) {

  try {
    let updateData = req.params.userId
    let updatingdata = req.body
    

    const { firstname, lastname, email, phone, password,} = updatingdata



    if (validator.validEmail(updatingdata.email)) {

      let isEmailAlreadyUsed = await userModel.findOne({ email });

      if (isEmailAlreadyUsed == email) {
        return res.status(400).send({ status: false, msg: `this ${email} is already registered` });

      }
    }

    if (validator.isValid(phone)) {

      if (!validator.validPhone(phone)) {
        return res.status(400).send({ status: false, msg: "please enter the valid phone no." });

      }

      let isPhoneAlreadyUsed = await userModel.findOne({ phone });

      if (isPhoneAlreadyUsed) {
        return res.status(400).send({ status: false, msg: `this ${phone} is already registered` });
      }
    }

      if (!validator.isvalidPassword(password)) {
        return res.status(400).send({ status: false, msg: "please enter the valid password" });
      }
    

    let updateone = { firstname, lastname, email,  phone, password }

    let updaterUser = await userModel.findByIdAndUpdate({ _id: updateData }, { updateone }, { new: true })

    return res.status(200).send({ status: true, message: "User profile details", data: updaterUser })
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

/////..........................................................................................................


const deleteProfile = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!userId) {
            return res.status(400).send({ status: false, msg: "required userId" })
        }
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "invalid userId" })
        }
        let userIdNotExist = await userModel.findOne({ _id: userId })
        if (!userIdNotExist) {
            return res.status(404).send({ status: false, msg: "not found" })
        }
        if (userIdNotExist.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "This userId already deleted" })

        }

        let data = { isDeleted: true, deletedAt: moment() }
        const deleteData = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: data }, { new: true })
        let result = {
            _id: deleteData._id,
            firstname: deleteData.firstname,
            lastname: deleteData.lastname,
            userId: deleteData.userId,
            email: deleteData.email,
            phone: deleteData.phone,
            deleted: deleteData.isDeleted,
            password: deleteData.password,
            createdAt: deleteData.createdAt,
            updatedAt: deleteData.updatedAt

        }
        return res.status(200).send({ status:true, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}





module.exports={registerUser,loginUser,getProfile,updateProfile,deleteProfile}