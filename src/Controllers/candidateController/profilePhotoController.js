const ProfilePhotoModel = require("../../Models/candidateModel/profilePhoto");
const profileModel = require("../../Models/candidateModel/profileModel");

const SignUpModel = require("../../Models/signUpModel");
const { ObjectId } = require("mongoose").Types;
const { uploadFile } = require("../../awsConfigure/aws");

const storeProfilePhoto = async function (req, res) {
  try {
    let { candidateId } = req.params;
    if (!candidateId) {
      return res
        .status(400)
        .send({ status: false, message: "candidate id is required" });
    }
    let user = await SignUpModel.findOne({
      _id: new ObjectId(candidateId),
    });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    let files = req.files;

    if (files.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide the profile photo" });
    }

    console.log("files", files[0]);
    const uploadedImage = await uploadFile(files[0]);
    console.log("uploadImage", uploadedImage);

    // if (!candidateProfileDoc) {
    //   return res.status(404).send({ status: false, message: "candidate profile not found" });
    // }

    if (user.accountType == "Candidate") {
      const candidateProfileDoc = await profileModel.findOneAndUpdate(
        {
          candidateId: candidateId,
        },
        { profilePhoto: uploadedImage },
        { new: true }
      );

      user.profilePhoto = uploadedImage;
      const updatedAccount = await user.save();
      return res.status(200).send(updatedAccount);
    } else {
      user.profilePhoto = uploadedImage;
      const updatedAccount = await user.save();
      return res.status(200).send(updatedAccount);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { storeProfilePhoto };
