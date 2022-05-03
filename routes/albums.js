const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authenticateUser");
const {
  getAllAlbums,
  getAlbum,
  uploadAlbum,
  streamAudio,
} = require("../controllers/albums");

//Sound albums routes
router
  .route("/albums")
  .get(getAllAlbums, authenticateUser)
  .post(uploadAlbum, authenticateUser);

router.route("/albums/:id").get(getAlbum, authenticateUser);

router.route("/audio").get(streamAudio);
module.exports = router;
