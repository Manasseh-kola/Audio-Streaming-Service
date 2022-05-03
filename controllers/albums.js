const cassandra = require("../Database/connectCassandra");
const { BadRequestError } = require("../errors");
const { uploadFile, streamFile } = require("../AWS/s3Bucket");

//GET ALL ALBUMS
const getAllAlbums = async (req, res) => {
  const query = "SELECT * FROM headphones.soundAlbums";
  const params = [];
  cassandra
    .execute(query, params, { prepare: true })
    .then((soundAlbums) => {
      res.send(`Found ${len(soundAlbums)} albums in the database`);
    })
    .catch(function (err) {
      console.log(err);
    });
};

//GET ALBUM
const getAlbum = async (req, res) => {
  const { author_name, album_name } = req.body;
  const query =
    "SELECT * FROM headphones.soundAlbums WHERE author_name =? AND album_name=? ";
  const params = [author_name, album_name];

  cassandra
    .execute(query, params, { prepare: true })
    .then((soundAlbum) => {
      res.send(
        `${soundAlbum.album_name} has ${soundAlbum.downloads} downloads`
      );
    })
    .catch(function (err) {
      console.log(err);
    });
};

//Stream audio file
const streamAudio = async (req, res) => {
  const { audio_Id } = req.body;
  try {
    //Audio Stream
    streamFile(audio_Id).pipe(res);
  } catch (err) {
    console.log(err);
  }
};

//POST NEW ALBUM
const uploadAlbum = async (req, res) => {
  const file = req.file.buffer;
  const { audio_Id, album_name, author_name, genre } = req.body;
  const created_at = Math.floor(new Date().getTime() / 1000);
  const key = "album_name,author_name,genre,audio_id,created_at";
  const query = `INSERT INTO headphones.soundAlbums (${key}) VALUES(?,?,?,?,?)`;
  const params = [album_name, author_name, genre, audio_Id, created_at];

  cassandra
    .execute(query, params, { prepare: true })
    .then(async function () {
      try {
        //Upload audio file
        const result = await uploadFile(file, audio_Id);
        console.log(result);
        res.sendStatus(201).json({ msg: "saved" });
      } catch (err) {
        console.log(err);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};

module.exports = {
  getAllAlbums,
  getAlbum,
  uploadAlbum,
  streamAudio,
};
